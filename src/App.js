import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import Layout from "./components/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazyLoad, lazyLoadWithRetry, prefetchComponent } from "./utils/codeSplitting";

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-16 w-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-4"></div>
      <div className="h-4 w-32 bg-gray-700 rounded mb-2"></div>
      <div className="h-3 w-24 bg-gray-800 rounded"></div>
    </div>
  </div>
);

// Lazy load page components with improved error handling
const HomePage = lazyLoadWithRetry(
  () => import("./pages/HomePage"),
  { fallback: <PageLoader />, maxRetries: 2 }
);
const AboutPage = lazyLoad(
  () => import("./pages/AboutPage"),
  { fallback: <PageLoader /> }
);
const ServicesPage = lazyLoad(
  () => import("./pages/ServicesPage"),
  { fallback: <PageLoader /> }
);
const ProjectsPage = lazyLoad(
  () => import("./pages/ProjectsPage"),
  { fallback: <PageLoader /> }
);
const ContactPage = lazyLoad(
  () => import("./pages/ContactPage"),
  { fallback: <PageLoader /> }
);
const Brochure = lazyLoad(
  () => import("./components/Brochure"),
  { fallback: <PageLoader /> }
);

// Prefetch components that are likely to be visited
prefetchComponent(() => import("./pages/AboutPage"));
prefetchComponent(() => import("./pages/ServicesPage"));

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/brochure" element={<Brochure />} />
            </Routes>
          </Layout>
        </Router>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;