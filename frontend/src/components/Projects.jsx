import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ExternalLink, Eye, X } from 'lucide-react';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', 'EdTech', 'Business', 'Data Science', 'Mobile', 'Data Analysis', 'Education'];

  const projects = [
    {
      id: 1,
      title: "LuminaIQ",
      category: "EdTech",
      description: "AI-powered learning platform with adaptive question generation and real-time performance evaluation.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
      tags: ["AI", "Education", "React", "Python"],
      highlights: ["Adaptive Quiz Generation", "Real-time Feedback", "Gamified Progress", "Multi-language Support"],
      metrics: {
        users: "10K+",
        accuracy: "94%",
        engagement: "85%"
      },
      demoUrl: "#",
      caseStudyUrl: "#"
    },
    {
      id: 2,
      title: "CRM Pro Suite",
      category: "Business",
      description: "Comprehensive CRM solution with AI-powered analytics, billing management, and investment tracking.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      tags: ["CRM", "Analytics", "Dashboard", "AI"],
      highlights: ["Drag-Drop Reporting", "Role-based Permissions", "Audit Logs", "Predictive Analytics"],
      metrics: {
        efficiency: "60%",
        satisfaction: "98%",
        roi: "300%"
      },
      demoUrl: "#",
      caseStudyUrl: "#"
    },
    {
      id: 3,
      title: "DataForge ML",
      category: "Data Science",
      description: "End-to-end machine learning pipeline with automated model selection and deployment capabilities.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tags: ["ML", "Python", "Docker", "Kubernetes"],
      highlights: ["AutoML Capabilities", "Model Deployment", "Data Visualization", "API Integration"],
      metrics: {
        accuracy: "96%",
        speed: "10x",
        scalability: "∞"
      },
      demoUrl: "#",
      caseStudyUrl: "#"
    },
    {
      id: 4,
      title: "Tabble Manager",
      category: "Mobile",
      description: "Sensor-driven hotel table management system with real-time occupancy tracking and analytics.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
      tags: ["React Native", "IoT", "Real-time", "Analytics"],
      highlights: ["Sensor Integration", "Real-time Updates", "Offline Sync", "Analytics Dashboard"],
      metrics: {
        efficiency: "40%",
        accuracy: "99%",
        uptime: "99.9%"
      },
      demoUrl: "#",
      caseStudyUrl: "#"
    },
    {
      id: 5,
      title: "Zen Analyzer Pro",
      category: "Data Analysis",
      description: "AI-powered data analysis tool that transforms CSV/Excel files into interactive insights and visualizations.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tags: ["AI", "Analytics", "Visualization", "NLP"],
      highlights: ["Natural Language Queries", "Auto-Visualization", "Export Capabilities", "Multi-format Support"],
      metrics: {
        speed: "50x",
        accuracy: "95%",
        satisfaction: "96%"
      },
      demoUrl: "#",
      caseStudyUrl: "#"
    },
    {
      id: 6,
      title: "EduTech Suite",
      category: "Education",
      description: "Comprehensive educational platform with anonymous feedback system and AI-powered learning analytics.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
      tags: ["Education", "React", "AI", "Analytics"],
      highlights: ["Anonymous Feedback", "Learning Analytics", "Progress Tracking", "Multi-tenant Support"],
      metrics: {
        adoption: "89%",
        engagement: "76%",
        retention: "92%"
      },
      demoUrl: "#",
      caseStudyUrl: "#"
    }
  ];

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our
            </span>
            <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore our portfolio of cutting-edge AI solutions that have transformed businesses across industries.
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-300 hover:to-yellow-500"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-yellow-400 hover:border-yellow-400/30"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="group bg-gray-900/50 backdrop-blur-sm border-gray-800/50 overflow-hidden hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-lg hover:shadow-yellow-400/10"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-yellow-400/90 text-black hover:bg-yellow-300"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/20"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-yellow-400/10 border-yellow-400/30 text-yellow-400">
                    {project.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300">
                  {project.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs bg-gray-800/50 border-gray-700/50 text-gray-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
            <DialogContent className="max-w-4xl bg-gray-900 border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-yellow-400">
                  {selectedProject.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-yellow-400 mb-2">Key Highlights</h4>
                      <ul className="space-y-1">
                        {selectedProject.highlights.map((highlight, index) => (
                          <li key={index} className="text-gray-300 text-sm">• {highlight}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-yellow-400 mb-2">Metrics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedProject.metrics).map(([key, value]) => (
                          <div key={key} className="text-center p-3 bg-gray-800/50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-400">{value}</div>
                            <div className="text-xs text-gray-400 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {selectedProject.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-yellow-400 mb-3">Technology Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          className="bg-yellow-400/10 border-yellow-400/30 text-yellow-400"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-300 hover:to-yellow-500">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Demo
                    </Button>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800/50">
                      Case Study
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
};

export default Projects;