import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import LazyImage from './LazyImage';
import { 
  Globe, 
  Users, 
  ArrowRight
} from 'lucide-react';

const ServicesPreview = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "AI-Integrated Websites",
      description: "Elevate your digital presence with our cutting-edge websites that harness the power of AI to create immersive, responsive experiences. Our solutions adapt to user behavior in real-time, delivering personalized content through stunning visuals and seamless interactions.",
      features: ["3D WebGL Integration", "Smart Content Adaptation", "Parallax Animations", "AI-Driven UX"],
      icon: Globe,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-cyan-500/30",
      backgroundImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Intelligent CRM Systems",
      description: "Revolutionize how you connect with customers through our AI-powered CRM platform. Anticipate needs before they arise, automate routine tasks, and gain deep insights from your customer data—all within an intuitive interface designed to boost productivity and drive growth.",
      features: ["Predictive Analytics", "Automated Workflows", "Smart Dashboards", "Real-time Insights"],
      icon: Users,
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-emerald-500/30",
      backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our
            </span>
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-300 leading-relaxed">
              We transform business challenges into opportunities through innovative AI solutions. Our services combine technical excellence with strategic insight to deliver measurable results that propel your business forward.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={index}
                className={`group relative overflow-hidden bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-lg hover:shadow-yellow-400/10 hover:scale-105`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <LazyImage
                    src={service.backgroundImage}
                    alt={`${service.title} background`}
                    className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110"
                    placeholderColor="#121212"
                  />
                </div>
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-gray-900/90 transition-all duration-500 group-hover:from-gray-900/70 group-hover:via-gray-900/60 group-hover:to-gray-900/80"></div>
                {/* Additional overlay for enhanced contrast */}
                <div className="absolute inset-0 bg-black/20 transition-all duration-500 group-hover:bg-black/10"></div>
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-white/10`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <p className="text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex}
                        variant="secondary" 
                        className="bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/30 transition-all duration-200"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/services')}
            size="lg"
            className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 font-medium px-8 py-4 text-lg backdrop-blur-sm group"
          >
            View All Services
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
