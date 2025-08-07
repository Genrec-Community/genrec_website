import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Download, 
  Mail, 
  Phone, 
  Globe, 
  Zap, 
  Shield, 
  Brain, 
  TrendingUp,
  Users,
  Cpu,
  Target,
  Award,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const Brochure = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      if (window.showNotification) {
        window.showNotification('success', '📄 Brochure downloaded successfully!', 3000);
      }
    }, 2000);
  };

  const services = [
    {
      icon: Brain,
      title: "AI Strategy & Consulting",
      description: "Transform your business with intelligent AI roadmaps tailored to your industry and goals."
    },
    {
      icon: Cpu,
      title: "Custom AI Development",
      description: "Build powerful AI solutions from machine learning models to intelligent automation systems."
    },
    {
      icon: Shield,
      title: "AI Security & Compliance",
      description: "Ensure your AI systems are secure, ethical, and compliant with industry regulations."
    },
    {
      icon: TrendingUp,
      title: "AI Analytics & Insights",
      description: "Unlock hidden patterns in your data with advanced AI-powered analytics and reporting."
    }
  ];

  const features = [
    "End-to-end AI solution development",
    "Privacy-first architecture design",
    "24/7 technical support & maintenance",
    "Scalable cloud-native deployments",
    "Industry-specific AI models",
    "Real-time performance monitoring"
  ];

  const industries = [
    { name: "Healthcare", icon: "🏥" },
    { name: "Finance", icon: "💰" },
    { name: "E-commerce", icon: "🛒" },
    { name: "Manufacturing", icon: "🏭" },
    { name: "Education", icon: "🎓" },
    { name: "Technology", icon: "💻" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-400/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-8">
            <img
              src="/Genrec_Full_Logo.png"
              alt="Genrec AI"
              className="h-32 w-auto drop-shadow-2xl"
            />
          </div>
          <h1 className="brochure-title text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-yellow-400 to-white bg-clip-text text-transparent">
              GENREC AI
            </span>
          </h1>
          <p className="brochure-subtitle text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transforming businesses with cutting-edge artificial intelligence solutions
          </p>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="interactive-button bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black font-bold px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 hover:scale-105 max-sm:px-6 max-sm:py-3 max-sm:text-base"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Preparing Download...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Brochure
              </>
            )}
          </Button>
        </div>

        {/* Company Overview */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 mb-16">
          <CardContent className="p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                About Genrec AI
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  At Genrec AI, we don't just build software—we craft intelligent ecosystems that evolve, adapt, and anticipate. Our mission is to bridge the gap between human creativity and machine intelligence, creating solutions that feel intuitive yet perform beyond expectations.
                </p>
                <div className="brochure-stats grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-800/30 rounded-lg glass-effect-dark">
                    <div className="text-2xl font-bold text-yellow-400">5+</div>
                    <div className="text-sm text-gray-400">MVPs Built</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/30 rounded-lg glass-effect-dark">
                    <div className="text-2xl font-bold text-yellow-400">2</div>
                    <div className="text-sm text-gray-400">Tools Launched</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/30 rounded-lg glass-effect-dark">
                    <div className="text-2xl font-bold text-yellow-400">85%</div>
                    <div className="text-sm text-gray-400">Satisfaction Rate</div>
                  </div>
                  <div className="text-center p-4 bg-gray-800/30 rounded-lg glass-effect-dark">
                    <div className="text-2xl font-bold text-yellow-400">2+</div>
                    <div className="text-sm text-gray-400">Years Experience</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">Why Choose Genrec AI?</h3>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                        <p className="text-gray-300">{service.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Industries */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Industries We Serve
            </span>
          </h2>
          <div className="brochure-industries grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry, index) => (
              <Card key={index} className="brochure-card bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105 glass-effect-dark">
                <CardContent className="p-6 text-center max-sm:p-4">
                  <div className="text-3xl mb-2 max-sm:text-2xl">{industry.icon}</div>
                  <div className="text-sm font-medium text-gray-300 max-sm:text-xs">{industry.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border-yellow-400/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Ready to Transform Your Business?
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how Genrec AI can revolutionize your operations with cutting-edge artificial intelligence solutions.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">contact@genrecai.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">www.genrecai.com</span>
              </div>
            </div>
            <Button
              className="interactive-button bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:scale-105 max-sm:px-6 max-sm:py-2 max-sm:text-sm"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Brochure;
