import React from "react";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        {/* Background video container for all sections after hero */}
        <div className="relative">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="fixed top-0 left-0 w-full h-full object-cover z-0"
            style={{ zIndex: -1 }}
          >
            <source src="/background-video.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay for better text readability */}
          <div className="fixed top-0 left-0 w-full h-full bg-black/70 z-0" style={{ zIndex: -1 }}></div>

          {/* Content sections with relative positioning */}
          <div className="relative z-10">
            <About />
            <Services />
            <Projects />
            <Contact />
          </div>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;