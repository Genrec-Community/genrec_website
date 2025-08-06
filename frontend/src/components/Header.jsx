import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/80 backdrop-blur-md border-b border-gray-800/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_futurehome/artifacts/ctjqr19b_Genrec_Mini_Logo-removebg-preview.png" 
              alt="Genrec AI" 
              className="w-10 h-10"
            />
            <img 
              src="https://customer-assets.emergentagent.com/job_futurehome/artifacts/0fkp6gzh_Genrec_Full_Logo-removebg-preview.png" 
              alt="GENREC" 
              className="h-8"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {item.label}
              </a>
            ))}
            <Button 
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
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                >
                  {item.label}
                </a>
              ))}
              <Button 
                className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 transition-all duration-200 w-full mt-4"
              >
                Get Started
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;