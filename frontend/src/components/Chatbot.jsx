import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, X, Send, Bot, User, Trash2, Mail, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import apiService from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm AskMe, Genrec AI sales expert 🤖. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(1);
  const [showCommonQuestions, setShowCommonQuestions] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [conversationData, setConversationData] = useState({
    sessionId: Date.now().toString(),
    startTime: new Date(),
    messages: [],
    userInfo: {},
    feedback: []
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const commonQuestions = [
    "I want to create an AI-integrated website",
    "I need help with a CRM system",
    "I want to build a data science MVP",
    "Tell me about your mobile app development",
    "How much do your services cost?",
    "What's your development process?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize conversation with backend
  const initializeConversation = async () => {
    try {
      const response = await apiService.createConversationWithFallback({
        sessionId: conversationData.sessionId,
        userEmail: userEmail,
        userName: userName
      });

      if (response.success) {
        console.log('Conversation initialized:', response.data);
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  // Save user info to backend
  const saveUserInfo = async (email, name) => {
    const userInfo = { email, name, timestamp: new Date() };
    setConversationData(prev => ({
      ...prev,
      userInfo
    }));

    setUserEmail(email);
    setUserName(name);

    // Initialize conversation with user info
    try {
      await apiService.createConversationWithFallback({
        sessionId: conversationData.sessionId,
        userEmail: email,
        userName: name
      });
    } catch (error) {
      console.error('Error saving user info:', error);
      // Fallback to localStorage
      try {
        localStorage.setItem('genrec_user_info', JSON.stringify(userInfo));
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
      }
    }
  };

  // Save message to backend
  const saveMessage = async (messageData) => {
    try {
      await apiService.addMessage({
        sessionId: conversationData.sessionId,
        messageId: messageData.id?.toString(),
        sender: messageData.sender,
        content: messageData.text
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Save feedback to backend
  const saveFeedback = async (rating, feedbackText, messageId) => {
    try {
      const response = await apiService.submitFeedbackWithFallback({
        sessionId: conversationData.sessionId,
        rating,
        feedbackText,
        messageId,
        userEmail: userEmail
      });

      if (response.success) {
        console.log('Feedback saved:', response.data);
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleLeaveFeedback = () => {
    setShowFeedbackModal(true);
  };

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
  };

  const handleFeedbackSubmit = async () => {
    if (selectedRating === 0) return;

    // Save feedback to backend
    await saveFeedback(selectedRating, feedbackText, null);

    const feedbackMessage = {
      id: messageCount + 1,
      text: `Thank you for your ${selectedRating}/10 rating! 🌟 ${feedbackText ? `Your feedback: "${feedbackText}"` : ''} We appreciate your input and will use it to improve AskMe and our services!`,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, feedbackMessage]);
    setMessageCount(prev => prev + 1);
    setShowFeedbackModal(false);
    setSelectedRating(0);
    setFeedbackText('');

    // Save the feedback message too
    await saveMessage(feedbackMessage);
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    setSelectedRating(0);
    setFeedbackText('');
  };

  const handleClearConversation = () => {
    setMessages([
      {
        id: 1,
        text: "Hi! I'm AskMe, Genrec AI sales expert 🤖. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setMessageCount(1);
  };

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() || isTyping) return;

    const userMessage = {
      id: messageCount + 1,
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setMessageCount(prev => prev + 2);
    setShowCommonQuestions(false);

    // Save user message to backend
    await saveMessage(userMessage);

    // Track message in conversation data
    setConversationData(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    // Show email modal after first message if no email collected
    if (messageCount === 1 && !userEmail) {
      setTimeout(() => setShowEmailModal(true), 2000);
    }

    // Simulate API call delay
    setTimeout(() => {
      const botResponse = generatePlaceholderResponse(textToSend);
      const botMessage = {
        id: messageCount + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Save bot message to backend
      saveMessage(botMessage);
    }, 800 + Math.random() * 1200);
  };

  const handleQuestionClick = (question) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generatePlaceholderResponse = (userInput) => {
    const input = userInput.toLowerCase();

    // Comprehensive placeholder responses based on keywords
    if (input.includes('service') || input.includes('what do you do') || input.includes('offer')) {
      return "We offer 8 core AI services:\n\n🌐 AI-Integrated Websites - 3D WebGL, parallax effects, smart content adaptation\n👥 Intelligent CRM Systems - Predictive analytics, automated workflows\n🧠 Data Science MVPs - Custom ML models, data pipelines\n📱 AI-Powered Mobile Apps - React Native/Flutter with sensor integration\n⚙️ Web Services & APIs - Microservices, auto-scaling, Kubernetes\n📊 Zen Analyzer - AI-driven CSV/Excel analysis with Q&A\n🛒 Smart E-commerce - Headless storefronts with AR previews\n🎓 Educational AI - Adaptive learning platforms\n\nWhich service interests you most?";
    }

    if (input.includes('project') || input.includes('portfolio') || input.includes('work') || input.includes('example')) {
      return "Here are our featured projects:\n\n🎓 LuminaIQ - AI learning platform (10K+ users, 94% accuracy)\n💼 CRM Pro Suite - Business management with AI analytics\n🔬 DataForge ML - End-to-end ML pipeline with auto-deployment\n🏨 Tabble Manager - IoT hotel table management system\n📈 Zen Analyzer Pro - Interactive data analysis tool\n🏫 EduTech Suite - Educational platform with anonymous feedback\n\nWe've delivered 10+ projects across 3+ industries with 88% client satisfaction. Visit our Projects page to see detailed case studies!";
    }

    if (input.includes('contact') || input.includes('get started') || input.includes('hire') || input.includes('work with')) {
      return "Ready to start your AI journey? Here's how to get in touch:\n\n📧 Email: hello@genrec.ai\n📞 Phone: +1 (555) 123-4567\n📍 Location: San Francisco, CA\n\n⚡ Quick Response: We typically respond within 4-6 hours during business hours\n\n📝 Best way: Fill out our detailed project form on the Contact page - it helps us understand your needs better and provide a more accurate quote. What type of project are you considering?";
    }

    if (input.includes('price') || input.includes('cost') || input.includes('budget') || input.includes('quote')) {
      return "Our pricing is tailored to your specific needs:\n\n💡 MVP Development: Starting point for new ideas\n🏢 Enterprise Solutions: Scalable, production-ready systems\n🔧 Custom Integrations: Existing system enhancements\n\nFactors affecting pricing:\n• Project complexity & scope\n• Timeline requirements\n• Technology stack\n• Ongoing support needs\n\nFor an accurate quote, please share your project details on our Contact page. We'll provide a customized proposal within 24 hours!";
    }

    if (input.includes('ai') || input.includes('artificial intelligence') || input.includes('machine learning') || input.includes('ml')) {
      return "We're experts in cutting-edge AI technologies:\n\n🤖 Machine Learning: Custom models, predictive analytics\n💬 Natural Language Processing: Text analysis, chatbots\n👁️ Computer Vision: Image recognition, AR integration\n📊 Data Science: Pipeline automation, real-time processing\n🔒 Privacy-First: Zero-knowledge systems, data protection\n☁️ Cloud-Native: Scalable, future-proof architecture\n🔄 24/7 AI Support: Self-monitoring and optimization\n\nOur AI solutions are designed to be business-focused and ROI-driven. What AI capabilities would transform your business?";
    }

    if (input.includes('about') || input.includes('company') || input.includes('team') || input.includes('who are you')) {
      return "Welcome to Genrec AI! 🚀\n\nWe're a cutting-edge AI company that crafts intelligent ecosystems that evolve, adapt, and anticipate. Our mission is bridging the gap between human creativity and machine intelligence.\n\n🏆 Our Track Record:\n• 10+ AI projects delivered\n• 3+ industries served\n• 88% client satisfaction\n• 2+ years of experience\n• 24/7 AI support\n\nWe specialize in privacy-first architecture, end-to-end delivery, and scalable solutions. Ready to forge the future together?";
    }

    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('start')) {
      return "Hello! 👋 Welcome to Genrec AI!\n\nI'm your AI assistant, here to help you discover how we can transform your business with intelligent solutions. I can tell you about:\n\n🔹 Our AI services & technologies\n🔹 Project portfolio & case studies\n🔹 Pricing & getting started\n🔹 Our team & company info\n🔹 Technical capabilities\n\nWhat would you like to explore first? Just ask me anything about Genrec AI!";
    }

    if (input.includes('technology') || input.includes('tech stack') || input.includes('tools')) {
      return "Our technology stack includes:\n\n🎨 Frontend: React, Next.js, 3D WebGL, Tailwind CSS\n⚙️ Backend: Node.js, Python, REST/GraphQL APIs\n🤖 AI/ML: TensorFlow, PyTorch, scikit-learn, OpenAI\n📱 Mobile: React Native, Flutter, sensor integration\n☁️ Cloud: AWS, Kubernetes, Docker, microservices\n💾 Databases: PostgreSQL, MongoDB, Redis\n📊 Analytics: Real-time processing, predictive models\n\nWe choose the best tools for each project to ensure optimal performance and scalability!";
    }

    if (input.includes('support') || input.includes('maintenance') || input.includes('help')) {
      return "We provide comprehensive support:\n\n🔧 24/7 AI Monitoring: Our systems self-monitor and optimize\n⚡ Quick Response: 4-6 hours during business hours\n🛠️ Ongoing Maintenance: Regular updates and improvements\n📈 Performance Optimization: Continuous enhancement\n🎓 Training & Documentation: Complete knowledge transfer\n💬 Direct Communication: Dedicated project channels\n\nOur AI solutions are built to be self-sustaining, but we're always here when you need us!";
    }

    // Default response with helpful suggestions
    return "That's an interesting question! 🤔\n\nI can help you with information about:\n• Our AI services & capabilities\n• Project portfolio & case studies\n• Pricing & getting started\n• Technology stack & tools\n• Company info & team\n• Support & maintenance\n\nTry asking me something like:\n- 'What services do you offer?'\n- 'Show me your projects'\n- 'How do I get started?'\n- 'What's your tech stack?'\n\nOr visit our pages directly for detailed information!";
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 max-sm:bottom-4 max-sm:right-4">
        {!isOpen && (
          <Button
            onClick={toggleChatbot}
            className="flex items-center space-x-3 px-4 py-3 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 chatbot-pulse hover:scale-105 max-sm:px-3 max-sm:py-2 max-sm:h-12 max-sm:space-x-2"
          >
            <MessageCircle className="w-6 h-6 max-sm:w-5 max-sm:h-5" />
            <span className="text-black font-semibold text-sm max-sm:text-xs">AskMe</span>
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-gray-900/95 backdrop-blur-md border border-gray-800/50 rounded-2xl shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-4 duration-300 hover:shadow-yellow-400/10
        md:w-96 md:h-[600px]
        sm:w-80 sm:h-[500px]
        xs:w-full xs:h-[450px] xs:bottom-4 xs:right-4 xs:left-4 xs:rounded-xl
        max-sm:w-[calc(100vw-2rem)] max-sm:h-[70vh] max-sm:bottom-4 max-sm:right-4 max-sm:left-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800/50 max-sm:p-3">
            <div className="flex items-center space-x-3 max-sm:space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-lg flex items-center justify-center max-sm:w-8 max-sm:h-8">
                <Bot className="w-5 h-5 text-yellow-400 max-sm:w-4 max-sm:h-4" />
              </div>
              <div>
                <h3 className="text-white font-semibold max-sm:text-sm">AskMe</h3>
              </div>
            </div>
            <div className="flex items-center space-x-2 max-sm:space-x-1">
              <Button
                onClick={handleLeaveFeedback}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-yellow-400 max-sm:p-1"
                title="Leave feedback"
              >
                <span className="text-sm max-sm:text-xs">😊</span>
              </Button>
              <Button
                onClick={handleClearConversation}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-yellow-400 max-sm:p-1"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
              </Button>
              <Button
                onClick={toggleChatbot}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-yellow-400 max-sm:p-1"
                title="Close chat"
              >
                <X className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-sm:p-3 max-sm:space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} message-fade-in`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl transition-all duration-200 hover:scale-105 max-sm:p-2 max-sm:text-sm max-sm:max-w-[85%] ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-md'
                      : 'bg-gray-800/50 text-white border border-gray-700/50 hover:border-gray-600/50'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {message.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800/50 text-white border border-gray-700/50 shadow-sm p-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-yellow-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Common Questions */}
            {showCommonQuestions && messages.length === 1 && (
              <div className="px-4 py-2 max-sm:px-3">
                <p className="text-sm text-gray-400 mb-3 max-sm:text-xs">Common questions are:</p>
                <div className="space-y-2 max-sm:space-y-1">
                  {commonQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      className="w-full text-left p-3 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30 hover:border-yellow-400/50 rounded-lg text-sm text-gray-300 hover:text-yellow-400 transition-all duration-200 shadow-sm max-sm:p-2 max-sm:text-xs max-sm:rounded-md"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800/50 max-sm:p-3">
            <div className="flex space-x-2 mb-2 max-sm:space-x-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell us how we can help..."
                className="flex-1 bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-yellow-400/50 max-sm:text-sm max-sm:placeholder:text-xs"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 max-sm:px-3"
              >
                <Send className="w-4 h-4 max-sm:w-3 max-sm:h-3" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center max-sm:text-[10px]">AI may produce inaccurate information</p>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-md border border-gray-800/50 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
              <h3 className="text-xl font-semibold text-white">Rate your experience using AskMe</h3>
              <Button
                onClick={handleFeedbackClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-yellow-400"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Rating Scale */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-400">Poor</span>
                  <span className="text-sm text-gray-400">Excellent</span>
                </div>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingSelect(rating)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 font-semibold ${
                        selectedRating === rating
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-400 text-black scale-110 shadow-lg shadow-yellow-400/30'
                          : selectedRating > 0 && rating <= selectedRating
                          ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                          : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-yellow-400/30 hover:text-yellow-400'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Text Feedback */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Tell us more (optional)
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your thoughts about AskMe..."
                  className="w-full p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400/50 focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleFeedbackSubmit}
                disabled={selectedRating === 0}
                className="w-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
