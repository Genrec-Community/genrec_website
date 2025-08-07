import React from 'react';
import Hero from '../components/Hero';
import ServicesPreview from '../components/ServicesPreview';
import ProjectsPreview from '../components/ProjectsPreview';

const HomePage = () => {
  return (
    <div className="relative min-h-screen">
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

      {/* Hero Content */}
      <div className="relative z-10">
        <Hero />
      </div>

      {/* Services Preview */}
      <div className="relative z-10">
        <ServicesPreview />
      </div>

      {/* Projects Preview */}
      <div className="relative z-10">
        <ProjectsPreview />
      </div>
    </div>
  );
};

export default HomePage;
