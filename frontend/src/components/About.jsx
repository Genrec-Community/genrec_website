import React from 'react';
import { Card, CardContent } from './ui/card';
import { ShieldCheck, Zap, TrendingUp, Cpu } from 'lucide-react';

const About = () => {
  const features = [
    {
      title: "Privacy-First Architecture",
      description: "Zero-knowledge systems that protect your data while maximizing AI capabilities.",
      icon: ShieldCheck
    },
    {
      title: "End-to-End Delivery",
      description: "From concept to deployment, we handle every aspect of your AI transformation.",
      icon: Zap
    },
    {
      title: "Scalable Solutions",
      description: "Built for growth with cloud-native architecture and future-proof design.",
      icon: TrendingUp
    },
    {
      title: "24/7 AI Support",
      description: "Our AI systems monitor and optimize themselves, ensuring peak performance.",
      icon: Cpu
    }
  ];

  const stats = [
    { number: "10+", label: "MVPs Built" },
    { number: "5", label: "Tools Launched" },
    { number: "100%", label: "Uptime" },
    { number: "3", label: "Years Experience" }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Forging the
            </span>
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Future
            </span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-300 leading-relaxed">
              At Genrec AI, we don't just build software—we craft intelligent ecosystems that evolve, adapt, and anticipate. Our mission is to bridge the gap between human creativity and machine intelligence, creating solutions that feel intuitive yet perform beyond expectations.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:bg-gray-800/60 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;