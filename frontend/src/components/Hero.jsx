import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronDown, Zap, Users, TrendingUp, Cpu } from 'lucide-react';

const Hero = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const texts = [
    'thinks, learns, and evolves.',
    'adapts to your business.',
    'transforms your vision.',
    'powers your success.'
  ];

  useEffect(() => {
    const typeText = () => {
      const fullText = texts[currentIndex];
      
      if (isTyping) {
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsTyping(false), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setCurrentIndex((currentIndex + 1) % texts.length);
          setIsTyping(true);
        }
      }
    };

    const timer = setTimeout(typeText, isTyping ? 100 : 50);
    return () => clearTimeout(timer);
  }, [currentText, currentIndex, isTyping, texts]);

  const stats = [
    { icon: Zap, number: "10+", label: "Projects Delivered" },
    { icon: Users, number: "3+", label: "Industries Served" },
    { icon: TrendingUp, number: "88%", label: "Client Satisfaction" },
    { icon: Cpu, number: "24/7", label: "Support" }
  ];

  return (
    <section id="home" className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute inset-0">
          {/* Particle Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-20 grid-rows-20 gap-4 h-full w-full">
              {Array.from({ length: 400 }, (_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="text-center">
          {/* Logo Section */}
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              <img
                src="/logo.svg"
                alt="Genrec AI Logo"
                className="w-24 h-24 animate-pulse"
              />
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              GENREC
            </span>
            <span className="block text-4xl md:text-5xl bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent font-light">
              ARTIFICIAL INTELLIGENCE
            </span>
          </h1>

          {/* Dynamic Tagline */}
          <div className="h-24 mb-8 flex items-center justify-center">
            <p className="text-2xl md:text-3xl text-gray-300 font-light">
              We build AI that{' '}
              <span className="text-yellow-400 font-medium border-r-2 border-yellow-400 animate-pulse">
                {currentText}
              </span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-300 hover:to-yellow-500 font-medium px-8 py-4 text-lg shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
            >
              Start Your AI Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 font-medium px-8 py-4 text-lg backdrop-blur-sm"
            >
              Explore Projects
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="group text-center p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-lg hover:bg-gray-800/40 hover:border-yellow-400/30 transition-all duration-300"
                >
                  <IconComponent className="w-8 h-8 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ChevronDown className="w-6 h-6 text-yellow-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;