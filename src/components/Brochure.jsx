import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  Download,
  Mail,
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
      title: "AI-Integrated Websites",
      description: "Stunning websites powered by intelligent algorithms, featuring 3D models, parallax effects, and dynamic content adaptation.",
      features: ["3D WebGL Integration", "Smart Content Adaptation", "Parallax Animations", "AI-Driven UX"]
    },
    {
      icon: Users,
      title: "Intelligent CRM Systems",
      description: "Next-generation customer relationship management with predictive analytics and automated workflows.",
      features: ["Predictive Analytics", "Automated Workflows", "Smart Dashboards", "Real-time Insights"]
    },
    {
      icon: Cpu,
      title: "Data Science MVPs",
      description: "Rapid prototyping of machine learning solutions with custom pipelines and predictive models.",
      features: ["Custom ML Models", "Data Pipelines", "Predictive Analytics", "Real-time Processing"]
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Mobile Apps",
      description: "React Native and Flutter applications with sensor integration and offline-first architecture.",
      features: ["Cross-Platform", "Sensor Integration", "Offline Sync", "Push Notifications"]
    }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Proven Expertise",
      description: "Deep technical knowledge in AI/ML with hands-on experience in building scalable solutions."
    },
    {
      icon: Zap,
      title: "Rapid Development",
      description: "Agile development process that delivers MVPs quickly while maintaining high quality standards."
    },
    {
      icon: Target,
      title: "Custom Solutions",
      description: "Tailored AI solutions designed specifically for your business needs and industry requirements."
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Rigorous testing and quality control processes ensure reliable, production-ready solutions."
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
    { name: "E-commerce", icon: "🛒", description: "Smart shopping experiences with AI personalization" },
    { name: "Education", icon: "🎓", description: "Adaptive learning platforms with AI tutoring" },
    { name: "Healthcare", icon: "🏥", description: "AI-powered diagnostics and patient management" },
    { name: "Finance", icon: "💰", description: "Intelligent analytics and fraud detection" },
    { name: "Manufacturing", icon: "🏭", description: "Predictive maintenance and quality control" },
    { name: "Technology", icon: "💻", description: "Advanced AI tools and automation solutions" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechStart Inc.",
      text: "Genrec AI transformed our business with their intelligent CRM system. The predictive analytics have increased our sales by 40%.",
      rating: 5
    },
    {
      name: "Michael Chen",
      company: "EduLearn Platform",
      text: "Their AI-powered learning platform exceeded our expectations. The adaptive learning features have improved student engagement significantly.",
      rating: 5
    }
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
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                        <p className="text-gray-300 mb-4">{service.description}</p>
                        {service.features && (
                          <div className="space-y-2">
                            {service.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                <span className="text-sm text-gray-400">{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Why Choose Genrec AI?
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105 text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              What Our Clients Say
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Industries */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Industries We Serve
            </span>
          </h2>
          <div className="brochure-industries grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <Card key={index} className="brochure-card bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105 glass-effect-dark">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{industry.icon}</div>
                  <div className="text-lg font-semibold text-white mb-2">{industry.name}</div>
                  <div className="text-sm text-gray-400">{industry.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Overview */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Our Development Process
            </span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-400">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Discovery</h3>
              <p className="text-gray-400 text-sm">Understanding your business needs and requirements</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-400">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Design</h3>
              <p className="text-gray-400 text-sm">Creating detailed architecture and user experience</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-400">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Development</h3>
              <p className="text-gray-400 text-sm">Building your AI solution with cutting-edge technology</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-400">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Deployment</h3>
              <p className="text-gray-400 text-sm">Launching and maintaining your solution</p>
            </div>
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <Button
                onClick={() => window.open('mailto:contact@genrecai.com', '_self')}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5 mr-2" />
                Get Started Today
              </Button>
              <Button
                onClick={() => window.open('https://github.com/Genrec-Community', '_blank')}
                className="bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                View Our Work
              </Button>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">contact@genrecai.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300">Karur, Tamil Nadu</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">www.genrecai.com</span>
              </div>
            </div>
        
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Brochure;
