import React from 'react';
import About from '../components/About';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Static background with gradient */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-black z-0" style={{ zIndex: -1 }}></div>

      {/* Content */}
      <div className="relative z-10 pt-24 pb-8">
        <About />
      </div>
    </div>
  );
};

export default AboutPage;
