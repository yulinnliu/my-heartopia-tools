// Integration verifier that `atc integrate` runs in its candidate checkout
// (AGENTS.md § Integration verification). A refusal prints its token as the
// first stderr line, a summary after it, and exits 1 (9 for TIME_SLACK_INVALID).
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, realpathSync, writeFileSync } from "node:fs";
import path from "node:path";

const SHA = /^[0-9a-f]{40}$/;
const INPUTS = ["ATC_INTEGRATION_SHA", "ATC_CANDIDATE_DIR", "ATC_EXPECTED_MAIN_SHA", "ATC_REVIEWED_SOURCE_SHA"];
const NPM_CLI = path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");

const SLACK_VARIABLE = "ATC_TEST_TIME_SLACK";
const DECIMAL = /^\s*[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\s*$/;

class Refusal extends Error {
  constructor(token, detail, exitCode = 1) {
    super(detail);
    this.token = token;
    this.exitCode = exitCode;
  }
}

// The time slack as atc-testkit's timing.resolve reads it (docs/TESTKIT.md § Time slack of the
// workspace root): a number of seconds from 0 to 30, 2 when the variable is unset or empty.
function timeSlack() {
  const raw = process.env[SLACK_VARIABLE] ?? "";
  if (raw === "") return 2;
  const value = DECIMAL.test(raw) ? Number(raw) : NaN;
  if (!(Number.isFinite(value) && value >= 0 && value <= 30)) {
    throw new Refusal("TIME_SLACK_INVALID", `${SLACK_VARIABLE}=${JSON.stringify(raw)}: give a number of seconds from 0 to 30`, 9);
  }
  return value;
}

// Git runs without the caller's GIT_* variables, so it always acts on the candidate.
const gitEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.toUpperCase().startsWith("GIT_")));

function git(...args) {
  const result = spawnSync("git", args, { encoding: "utf8", env: gitEnv });
  if (result.error) throw new Refusal("VERIFIER_ERROR", `git ${args.join(" ")}: ${result.error.message}`);
  return result;
}

function gitOut(...args) {
  const result = git(...args);
  if (result.status !== 0) throw new Refusal("VERIFIER_ERROR", `git ${args.join(" ")}: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

function isAncestor(ancestor, descendant) {
  return git("merge-base", "--is-ancestor", ancestor, descendant).status === 0;
}

function npm(token, ...args) {
  // npm writes to stdout only, so a refusal token stays the first stderr line.
  const result = spawnSync(process.execPath, [NPM_CLI, ...args], { stdio: ["ignore", 1, 1] });
  if (result.error) throw new Refusal(token, `npm ${args.join(" ")}: ${result.error.message}`);
  if (result.status !== 0) throw new Refusal(token, `npm ${args.join(" ")} exited ${result.status}`);
  return `npm ${args.join(" ")}`;
}

function digest(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function sameDir(a, b) {
  const norm = (p) => realpathSync(p).replace(/[\\/]+$/, "");
  return process.platform === "win32" ? norm(a).toLowerCase() === norm(b).toLowerCase() : norm(a) === norm(b);
}

function verify() {
  const slack = timeSlack();
  const missing = INPUTS.filter((name) => !process.env[name]);
  if (missing.length) throw new Refusal("VERIFY_ENV_MISSING", `missing ${missing.join(", ")}`);
  const env = Object.fromEntries(INPUTS.map((name) => [name, process.env[name]]));
  const invalid = INPUTS.filter((name) => name.endsWith("_SHA") && !SHA.test(env[name]));
  if (invalid.length) throw new Refusal("VERIFY_ENV_INVALID", `not a full object ID: ${invalid.join(", ")}`);

  const top = gitOut("rev-parse", "--show-toplevel");
  if (!sameDir(process.cwd(), env.ATC_CANDIDATE_DIR) || !sameDir(top, env.ATC_CANDIDATE_DIR)) {
    throw new Refusal("CANDIDATE_DIR_MISMATCH", `cwd ${process.cwd()}, tree ${top}, ATC_CANDIDATE_DIR ${env.ATC_CANDIDATE_DIR}`);
  }
  const head = gitOut("rev-parse", "HEAD");
  if (head !== env.ATC_INTEGRATION_SHA) throw new Refusal("CANDIDATE_HEAD_MISMATCH", `HEAD ${head}`);
  if (!isAncestor(env.ATC_EXPECTED_MAIN_SHA, head)) throw new Refusal("EXPECTED_MAIN_NOT_IN_CANDIDATE", env.ATC_EXPECTED_MAIN_SHA);
  if (!isAncestor(env.ATC_REVIEWED_SOURCE_SHA, head)) throw new Refusal("REVIEWED_SOURCE_NOT_IN_CANDIDATE", env.ATC_REVIEWED_SOURCE_SHA);

  const pinned = readFileSync(".node-version", "utf8").trim().replace(/^v/, "");
  if (process.version !== `v${pinned}`) throw new Refusal("NODE_VERSION_MISMATCH", `node ${process.version}, .node-version ${pinned}`);

  const range = `${env.ATC_EXPECTED_MAIN_SHA}..${head}`;
  const diffCheck = git("diff", "--check", range);
  if (diffCheck.status !== 0) throw new Refusal("DIFF_CHECK_FAILED", (diffCheck.stdout + diffCheck.stderr).trim());

  const steps = [`git diff --check ${range}`];
  steps.push(npm("NPM_CI_FAILED", "ci", "--no-audit", "--no-fund"));
  steps.push(npm("TESTS_FAILED", "test"));
  steps.push(npm("BUILD_FAILED", "run", "build"));

  if (gitOut("rev-parse", "HEAD") !== head) throw new Refusal("CANDIDATE_HEAD_MOVED", "HEAD changed during verification");
  const status = gitOut("status", "--porcelain", "--untracked-files=all");
  if (status) throw new Refusal("CANDIDATE_DIRTY", status);

  if (process.env.ATC_VERIFICATION_REPORT) {
    // The atc-verification-report/2 shape (shared/conformance/verification-evidence/README.md of the
    // workspace root): every range runs the whole suite in one stage.
    const report = {
      schema: "atc-verification-report/2",
      selector: { name: "integration-verify.mjs", version: "1" },
      selection: { full: true, paths: [] },
      stages: [{ name: "vitest", marker: "all", ignore: [] }],
      dependency_inputs: { "package-lock.json": digest("package-lock.json"), ".node-version": digest(".node-version") },
      time_slack: slack,
      checks: steps,
      node: process.version,
    };
    try {
      writeFileSync(process.env.ATC_VERIFICATION_REPORT, JSON.stringify(report, null, 2) + "\n");
    } catch (error) {
      console.error(`verification report not written: ${error.message}`);
    }
  }
}

try {
  verify();
  console.log("integration verification passed");
} catch (error) {
  const token = error instanceof Refusal ? error.token : "VERIFIER_ERROR";
  console.error(token);
  console.error(error.message);
  process.exit(error instanceof Refusal ? error.exitCode : 1);
}
