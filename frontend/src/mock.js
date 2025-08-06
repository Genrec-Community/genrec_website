// Mock data for Genrec AI website

export const mockData = {
  // Hero Section
  hero: {
    title: "GENREC AI",
    subtitle: "We build AI that thinks, learns, and evolves.",
    tagline: "Forging the Future of Intelligent Software",
    stats: [
      { number: "50+", label: "AI Projects Delivered" },
      { number: "15+", label: "Industries Served" },
      { number: "99%", label: "Client Satisfaction" },
      { number: "24/7", label: "AI Support" }
    ]
  },

  // About Section
  about: {
    title: "Forging the Future",
    description: "At Genrec AI, we don't just build software—we craft intelligent ecosystems that evolve, adapt, and anticipate. Our mission is to bridge the gap between human creativity and machine intelligence, creating solutions that feel intuitive yet perform beyond expectations.",
    features: [
      {
        title: "Privacy-First Architecture",
        description: "Zero-knowledge systems that protect your data while maximizing AI capabilities.",
        icon: "shield-check"
      },
      {
        title: "End-to-End Delivery",
        description: "From concept to deployment, we handle every aspect of your AI transformation.",
        icon: "zap"
      },
      {
        title: "Scalable Solutions",
        description: "Built for growth with cloud-native architecture and future-proof design.",
        icon: "trending-up"
      },
      {
        title: "24/7 AI Support",
        description: "Our AI systems monitor and optimize themselves, ensuring peak performance.",
        icon: "cpu"
      }
    ],
    stats: [
      { number: "10+", label: "MVPs Built" },
      { number: "5", label: "Tools Launched" },
      { number: "100%", label: "Uptime" },
      { number: "3", label: "Years Experience" }
    ]
  },

  // Services Section
  services: [
    {
      title: "AI-Integrated Websites",
      description: "Stunning websites powered by intelligent algorithms, featuring 3D models, parallax effects, and dynamic content adaptation.",
      features: ["3D WebGL Integration", "Smart Content Adaptation", "Parallax Animations", "AI-Driven UX"],
      icon: "globe"
    },
    {
      title: "Intelligent CRM Systems",
      description: "Next-generation customer relationship management with predictive analytics and automated workflows.",
      features: ["Predictive Analytics", "Automated Workflows", "Smart Dashboards", "Real-time Insights"],
      icon: "users"
    },
    {
      title: "Data Science MVPs",
      description: "Rapid prototyping of machine learning solutions with custom pipelines and predictive models.",
      features: ["Custom ML Models", "Data Pipelines", "Predictive Analytics", "Real-time Processing"],
      icon: "brain"
    },
    {
      title: "AI-Powered Mobile Apps",
      description: "React Native and Flutter applications with sensor integration and offline-first architecture.",
      features: ["Cross-Platform", "Sensor Integration", "Offline Sync", "Push Notifications"],
      icon: "smartphone"
    },
    {
      title: "Web Services & APIs",
      description: "Scalable microservices architecture with REST/GraphQL APIs and Kubernetes deployment.",
      features: ["Microservices", "Auto-Scaling", "API Gateway", "Monitoring"],
      icon: "server"
    },
    {
      title: "Zen Analyzer",
      description: "Upload CSV/Excel files and get AI-driven insights, summaries, and interactive Q&A capabilities.",
      features: ["Natural Language Queries", "Chart Generation", "Data Export", "Interactive Analysis"],
      icon: "file-text"
    },
    {
      title: "Smart E-commerce",
      description: "Headless storefronts with AI personalization, AR product previews, and intelligent recommendations.",
      features: ["AI Personalization", "AR Previews", "Smart Recommendations", "Headless Architecture"],
      icon: "shopping-cart"
    },
    {
      title: "Educational AI",
      description: "Adaptive learning platforms with AI tutors, anonymous feedback systems, and progress tracking.",
      features: ["Adaptive Learning", "AI Tutoring", "Progress Analytics", "Anonymous Feedback"],
      icon: "graduation-cap"
    }
  ],

  // Projects Section
  projects: [
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
  ],

  // Contact Information
  contact: {
    email: "hello@genrec.ai",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA",
    social: {
      twitter: "https://twitter.com/genrecai",
      linkedin: "https://linkedin.com/company/genrec-ai",
      github: "https://github.com/genrec-ai"
    }
  },

  // Navigation
  navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" }
  ]
};