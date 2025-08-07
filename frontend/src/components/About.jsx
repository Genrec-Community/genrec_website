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
    { number: "5+", label: "MVPs Built" },
    { number: "2", label: "Tools Launched" },
    { number: "85%", label: "Satisfaction Rate" },
    { number: "2+", label: "Years Experience" }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent animate-pulse">
              Forging the
            </span>
            <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
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
                className="group bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:bg-gray-800/60 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-400/20"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <IconComponent className="w-8 h-8 text-yellow-400 group-hover:animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-8 hover:border-yellow-400/30 transition-all duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 group-hover:animate-pulse">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              What Our Clients Say
            </span>
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                company: "TechCorp Inc.",
                role: "CTO",
                testimonial: "Genrec AI transformed our business processes with their intelligent automation solutions. ROI was visible within 3 months!",
                rating: 5
              },
              {
                name: "Michael Chen",
                company: "DataFlow Systems",
                role: "CEO",
                testimonial: "The AI-powered analytics platform they built for us provides insights we never thought possible. Game-changing technology!",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                company: "InnovateLab",
                role: "Product Manager",
                testimonial: "Professional, innovative, and results-driven. Genrec AI delivered beyond our expectations with cutting-edge solutions.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.testimonial}"</p>
                <div className="border-t border-gray-800/50 pt-4">
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-yellow-400 text-sm">{testimonial.role}</p>
                  <p className="text-gray-400 text-sm">{testimonial.company}</p>
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