import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { localeFromPath } from "./heartopia/i18n";
import "./styles.css";

const root = document.getElementById("root")!;
const app = <StrictMode><App locale={localeFromPath(window.location.pathname)} /></StrictMode>;

if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
