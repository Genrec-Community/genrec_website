import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  ArrowUp, 
  Zap, 
  Calendar, 
  Download, 
  Phone, 
  Mail,
  FileText,
  ExternalLink
} from 'lucide-react';

const FloatingActions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ultra smooth expansion/collapse with optimized timing
  useEffect(() => {
    let timer;
    if (isHovering) {
      // Immediate expansion for responsiveness
      timer = setTimeout(() => setIsExpanded(true), 50);
    } else {
      // Slightly longer delay for collapse to prevent flickering
      timer = setTimeout(() => setIsExpanded(false), 150);
    }
    return () => clearTimeout(timer);
  }, [isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCalendly = () => {
    window.open('https://calendly.com/genrec-ai/consultation', '_blank');
  };

  const downloadBrochure = () => {
    navigate('/brochure');
  };

  const callUs = () => {
    window.open('tel:+1-555-123-4567', '_self');
  };

  const emailUs = () => {
    window.open('mailto:contact@genrecai.com', '_self');
  };

  const actions = [
    {
      icon: Calendar,
      label: 'Book Meeting',
      action: openCalendly,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-400 hover:to-blue-500'
    },
    {
      icon: FileText,
      label: 'Brochure',
      action: downloadBrochure,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-400 hover:to-purple-500'
    },
    {
      icon: Phone,
      label: 'Call Us',
      action: callUs,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-400 hover:to-green-500'
    },
    {
      icon: Mail,
      label: 'Email Us',
      action: emailUs,
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-400 hover:to-red-500'
    }
  ];

  return (
    <div
      className="fixed bottom-4 left-4 z-40"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col items-start space-y-3">
        {/* Scroll to Top Button - At the top when expanded */}
        {showScrollTop && isExpanded && (
          <div
            className="relative group transition-all duration-500 ease-out"
            style={{
              transitionDelay: isExpanded ? '240ms' : '0ms'
            }}
          >
            <Button
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-gray-400/40 transition-all duration-400 ease-out hover:scale-125 hover:-translate-y-1 transform-gpu"
              title="Back to Top"
            >
              <ArrowUp className="w-5 h-5 transition-transform duration-300 ease-out group-hover:scale-110" />
            </Button>

            {/* Label for Scroll to Top */}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-black/95 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out whitespace-nowrap pointer-events-none -translate-x-3 group-hover:translate-x-0 scale-90 group-hover:scale-100 shadow-lg">
              Back to Top
            </div>
          </div>
        )}

        {/* Action Buttons - Expand upward from main button */}
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <div
              key={index}
              className={`relative group transition-all duration-500 ease-out transform ${
                isExpanded
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                  : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
              }`}
              style={{
                transitionDelay: isExpanded
                  ? `${index * 80}ms`
                  : `${(actions.length - index - 1) * 40}ms`,
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* Button */}
              <Button
                onClick={action.action}
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} ${action.hoverColor} text-white shadow-lg transition-all duration-400 ease-out hover:scale-125 hover:shadow-2xl hover:-translate-y-1 transform-gpu`}
                title={action.label}
              >
                <IconComponent className="w-5 h-5 transition-transform duration-300 ease-out group-hover:scale-110" />
              </Button>

              {/* Label - Ultra smooth slide-in */}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-black/95 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out whitespace-nowrap pointer-events-none -translate-x-3 group-hover:translate-x-0 scale-90 group-hover:scale-100 shadow-lg">
                {action.label}
              </div>
            </div>
          );
        })}

        {/* Main Toggle Button - Always at the bottom */}
        <div className="relative group">
          <Button
            className={`w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black shadow-xl hover:shadow-yellow-400/40 transition-all duration-600 ease-out hover:scale-115 hover:-translate-y-1 transform-gpu ${
              isExpanded ? 'rotate-45 scale-115 shadow-yellow-400/50' : 'rotate-0 scale-100'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            title="Quick Actions"
          >
            <Zap className={`w-6 h-6 transition-all duration-600 ease-out transform-gpu ${
              isExpanded ? 'rotate-90 scale-110' : 'rotate-0 scale-100'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }} />
          </Button>

          {/* Label for Main Button */}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 bg-black/95 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out whitespace-nowrap pointer-events-none -translate-x-3 group-hover:translate-x-0 scale-90 group-hover:scale-100 shadow-lg">
            Quick Actions
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingActions;
