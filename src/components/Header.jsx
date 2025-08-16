import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" }
  ];

  const handleGetStarted = () => {
    navigate('/contact');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/80 backdrop-blur-md border-b border-gray-800/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 relative z-50">
            <div className="relative">
              <img
                src="/Genrec_Mini_Logo.png"
                alt="Genrec AI"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 relative z-10 filter drop-shadow-lg"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white font-orbitron filter drop-shadow-lg">GENREC</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 transition-all duration-200"
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-20 bg-black/80 backdrop-blur-xl z-40 animate-in fade-in-0 duration-300">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-black/70"></div>
            <nav className="relative z-10 p-6">
              <div className="flex flex-col space-y-6">
                {navigation.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-200 hover:text-white transition-all duration-300 text-lg font-medium py-3 px-4 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 transform hover:scale-105"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  onClick={() => {
                    handleGetStarted();
                    setIsMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/30 hover:text-black transition-all duration-300 w-full mt-6 py-3 backdrop-blur-sm hover:scale-105 shadow-lg"
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;