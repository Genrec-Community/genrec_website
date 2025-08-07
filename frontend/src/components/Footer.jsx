import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Twitter, Linkedin, Github, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" }
  ];

  const services = [
    "AI-Integrated Websites",
    "CRM Systems",
    "Data Science MVPs",
    "Mobile Applications",
    "Web Services & APIs"
  ];

  const resources = [
    "Case Studies",
    "Blog",
    "Documentation",
    "API Reference",
    "Support"
  ];

  return (
    <footer className="bg-black border-t border-gray-800/50">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="/Genrec_Full_Logo.png"
                  alt="Genrec AI"
                  className="h-36 w-auto"
                />
              </div>
              
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                At Genrec AI, we craft intelligent ecosystems that evolve, adapt, and anticipate. 
                Bridging the gap between human creativity and machine intelligence.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center hover:bg-yellow-400/20 hover:text-yellow-400 transition-all duration-200 group"
                >
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center hover:bg-yellow-400/20 hover:text-yellow-400 transition-all duration-200 group"
                >
                  <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center hover:bg-yellow-400/20 hover:text-yellow-400 transition-all duration-200 group"
                >
                  <Github className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center hover:bg-yellow-400/20 hover:text-yellow-400 transition-all duration-200 group"
                >
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-yellow-400" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service}>
                    <span className="text-gray-400 text-sm cursor-pointer hover:text-yellow-400 transition-colors duration-200">
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to our newsletter for the latest AI insights and updates.
              </p>
              
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-400/20"
                />
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-300 hover:to-yellow-500 font-medium">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2025 Genrec AI. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
                  Cookie Policy
                </a>
              </div>
            </div>

            {/* Scroll to Top */}
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-400 hover:bg-yellow-400/10 hover:border-yellow-400/30 hover:text-yellow-400"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;