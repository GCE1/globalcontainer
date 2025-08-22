import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";
import { preloadCriticalImages } from "./lib/imagePreloader";

// Disable scroll restoration to ensure pages always start from top
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Initial page load scroll to top
window.scrollTo(0, 0);

// Preload critical hero images immediately
preloadCriticalImages();

createRoot(document.getElementById("root")!).render(<App />);
