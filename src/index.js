import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { initFontOptimization } from "./utils/fontOptimizer";

// Initialize font optimization
initFontOptimization(
  // Critical fonts (load immediately)
  [
    {
      family: 'Inter',
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      weight: '400',
      type: 'font/woff2'
    }
  ],
  // Non-critical fonts (load after page load)
  [
    {
      family: 'Roboto Mono',
      url: 'https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap',
      weight: '400',
      type: 'font/woff2'
    }
  ]
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
