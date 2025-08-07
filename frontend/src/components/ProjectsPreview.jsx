import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  ExternalLink, 
  Github, 
  ArrowRight,
  GraduationCap,
  Building2
} from 'lucide-react';

const ProjectsPreview = () => {
  const navigate = useNavigate();

  const projects = [
    {
      title: "LuminaIQ",
      subtitle: "AI-Powered Learning Platform",
      description: "Revolutionary educational platform that adapts to individual learning styles using advanced machine learning algorithms.",
      image: "/api/placeholder/400/250",
      tags: ["React", "Python", "TensorFlow", "PostgreSQL"],
      metrics: {
        users: "10K+",
        accuracy: "94%",
        engagement: "85%"
      },
      icon: GraduationCap,
      color: "from-purple-500/20 to-pink-500/20",
      status: "Live",
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      title: "CRM Pro Suite",
      subtitle: "Intelligent Business Management",
      description: "Comprehensive CRM system with AI-driven analytics, automated workflows, and predictive customer insights.",
      image: "/api/placeholder/400/250",
      tags: ["Next.js", "Node.js", "MongoDB", "OpenAI"],
      metrics: {
        clients: "500+",
        automation: "70%",
        satisfaction: "96%"
      },
      icon: Building2,
      color: "from-blue-500/20 to-cyan-500/20",
      status: "Live",
      links: {
        demo: "#",
        github: "#"
      }
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Featured
            </span>
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-300 leading-relaxed">
              Discover our latest AI innovations that are transforming industries and creating new possibilities.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <Card
                key={index}
                className="group bg-gray-900/50 backdrop-blur-sm border-gray-800/50 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-lg hover:shadow-yellow-400/10 overflow-hidden"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className={`bg-gradient-to-r ${project.color} text-white border-0`}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button size="sm" variant="ghost" className="text-white hover:text-yellow-400 hover:bg-black/20">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:text-yellow-400 hover:bg-black/20">
                      <Github className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${project.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                        {project.title}
                      </CardTitle>
                      <p className="text-sm text-gray-400">{project.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {project.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-800/50">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-yellow-400">{value}</div>
                        <div className="text-xs text-gray-400 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex}
                        variant="secondary" 
                        className="bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/30 transition-all duration-200 text-xs"
                      >
                        {tag}
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
            onClick={() => navigate('/projects')}
            size="lg"
            className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 font-medium px-8 py-4 text-lg backdrop-blur-sm group"
          >
            View All Projects
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
