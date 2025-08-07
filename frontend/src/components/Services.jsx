import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Globe,
  Users,
  Brain,
  Smartphone,
  Server,
  FileText,
  ShoppingCart,
  GraduationCap
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: "AI-Integrated Websites",
      description: "Stunning websites powered by intelligent algorithms, featuring 3D models, parallax effects, and dynamic content adaptation.",
      features: ["3D WebGL Integration", "Smart Content Adaptation", "Parallax Animations", "AI-Driven UX"],
      icon: Globe,
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-cyan-500/30"
    },
    {
      title: "Intelligent CRM Systems",
      description: "Next-generation customer relationship management with predictive analytics and automated workflows.",
      features: ["Predictive Analytics", "Automated Workflows", "Smart Dashboards", "Real-time Insights"],
      icon: Users,
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-emerald-500/30"
    },
    {
      title: "Data Science MVPs",
      description: "Rapid prototyping of machine learning solutions with custom pipelines and predictive models.",
      features: ["Custom ML Models", "Data Pipelines", "Predictive Analytics", "Real-time Processing"],
      icon: Brain,
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-pink-500/30"
    },
    {
      title: "AI-Powered Mobile Apps",
      description: "React Native and Flutter applications with sensor integration and offline-first architecture.",
      features: ["Cross-Platform", "Sensor Integration", "Offline Sync", "Push Notifications"],
      icon: Smartphone,
      color: "from-orange-500/20 to-red-500/20",
      borderColor: "border-red-500/30"
    },
    {
      title: "Web Services & APIs",
      description: "Scalable microservices architecture with REST/GraphQL APIs and Kubernetes deployment.",
      features: ["Microservices", "Auto-Scaling", "API Gateway", "Monitoring"],
      icon: Server,
      color: "from-gray-500/20 to-slate-500/20",
      borderColor: "border-slate-500/30"
    },
    {
      title: "Zen Analyzer",
      description: "Upload CSV/Excel files and get AI-driven insights, summaries, and interactive Q&A capabilities.",
      features: ["Natural Language Queries", "Chart Generation", "Data Export", "Interactive Analysis"],
      icon: FileText,
      color: "from-yellow-500/20 to-amber-500/20",
      borderColor: "border-amber-500/30"
    },
    {
      title: "Smart E-commerce",
      description: "Headless storefronts with AI personalization, AR product previews, and intelligent recommendations.",
      features: ["AI Personalization", "AR Previews", "Smart Recommendations", "Headless Architecture"],
      icon: ShoppingCart,
      color: "from-indigo-500/20 to-blue-500/20",
      borderColor: "border-blue-500/30"
    },
    {
      title: "Educational AI",
      description: "Adaptive learning platforms with AI tutors, anonymous feedback systems, and progress tracking.",
      features: ["Adaptive Learning", "AI Tutoring", "Progress Analytics", "Anonymous Feedback"],
      icon: GraduationCap,
      color: "from-teal-500/20 to-cyan-500/20",
      borderColor: "border-teal-500/30"
    }
  ];

  return (
    <section id="services" className="py-20 relative">
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
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From AI-integrated websites to enterprise-grade machine learning solutions, we deliver cutting-edge technology that drives results.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={index}
                className="group bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-lg hover:shadow-yellow-400/10 hover:scale-105"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <Badge 
                        key={featureIndex} 
                        variant="outline" 
                        className="text-xs bg-gray-800/50 border-gray-700/50 text-gray-300 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-200"
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
      </div>
    </section>
  );
};

export default Services;