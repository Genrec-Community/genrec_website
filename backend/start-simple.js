// Simple backend server without complex dependencies
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Simple in-memory storage
let contacts = [];
let conversations = [];
let feedback = [];
let interactions = [];

// CORS Configuration - Fix the critical CORS policy issue
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple logger
const log = (msg, data) => console.log(`[${new Date().toISOString()}] ${msg}`, data || '');

// Additional CORS middleware to ensure headers are always present
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Contact form
app.post('/api/contacts', (req, res) => {
  try {
    const contact = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };
    contacts.push(contact);
    log('Contact received:', contact.email);
    res.json({ success: true, data: contact, message: 'Contact submitted successfully' });
  } catch (error) {
    log('Contact error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to submit contact' });
  }
});

// Feedback
app.post('/api/feedback', (req, res) => {
  try {
    const fb = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };
    feedback.push(fb);
    log('Feedback received:', `Rating: ${fb.rating}`);
    res.json({ success: true, data: fb, message: 'Feedback submitted successfully' });
  } catch (error) {
    log('Feedback error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
});

// Conversations
app.post('/api/conversations', (req, res) => {
  try {
    const conv = {
      id: Date.now(),
      ...req.body,
      messages: [],
      created_at: new Date().toISOString()
    };
    conversations.push(conv);
    log('Conversation created:', conv.sessionId);
    res.json({ success: true, data: conv, message: 'Conversation created' });
  } catch (error) {
    log('Conversation error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to create conversation' });
  }
});

// Messages
app.post('/api/conversations/message', (req, res) => {
  try {
    const message = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };
    
    const conv = conversations.find(c => c.sessionId === req.body.sessionId);
    if (conv) {
      conv.messages.push(message);
    }
    
    log('Message added:', `${req.body.sender}: ${req.body.content?.substring(0, 50)}...`);
    res.json({ success: true, data: message, message: 'Message added' });
  } catch (error) {
    log('Message error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to add message' });
  }
});

// Newsletter
app.post('/api/interactions/email', (req, res) => {
  try {
    const interaction = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };
    interactions.push(interaction);
    log('Email interaction:', `${req.body.email} - ${req.body.source}`);
    res.json({ 
      success: true, 
      data: interaction, 
      message: req.body.source === 'newsletter_subscription' ? 'Newsletter subscription successful' : 'Email saved'
    });
  } catch (error) {
    log('Email error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to process email' });
  }
});

// Analytics tracking
app.post('/api/analytics/track', (req, res) => {
  try {
    const track = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };
    interactions.push(track);
    log('Interaction tracked:', req.body.action);
    res.json({ success: true, message: 'Interaction tracked' });
  } catch (error) {
    log('Tracking error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to track' });
  }
});

// Dashboard
app.get('/api/admin/dashboard', (req, res) => {
  const today = new Date().toDateString();
  res.json({
    success: true,
    data: {
      conversations: {
        total_conversations: conversations.length,
        today_conversations: conversations.filter(c => new Date(c.created_at).toDateString() === today).length
      },
      contacts: {
        total_contacts: contacts.length,
        today_contacts: contacts.filter(c => new Date(c.created_at).toDateString() === today).length,
        new_contacts: contacts.length,
        in_progress_contacts: 0,
        completed_contacts: 0
      },
      feedback: {
        total_feedback: feedback.length,
        average_rating: feedback.length > 0 ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length : 0,
        positive_feedback: feedback.filter(f => f.rating >= 8).length,
        negative_feedback: feedback.filter(f => f.rating <= 5).length,
        with_comments: feedback.filter(f => f.feedbackText).length
      },
      users: {
        total_users: new Set(contacts.map(c => c.email)).size,
        new_today: contacts.filter(c => new Date(c.created_at).toDateString() === today).length
      }
    }
  });
});

// Data endpoints
app.get('/api/admin/contacts', (req, res) => res.json({ success: true, data: contacts }));
app.get('/api/admin/conversations', (req, res) => res.json({ success: true, data: conversations }));
app.get('/api/admin/feedback', (req, res) => res.json({ success: true, data: feedback }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Genrec AI Backend - Simple Version',
    status: 'Running',
    data_count: {
      contacts: contacts.length,
      conversations: conversations.length,
      feedback: feedback.length,
      interactions: interactions.length
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple Genrec AI Backend running on http://localhost:${PORT}`);
  console.log(`📊 All data stored in memory`);
  console.log(`🔗 Ready to receive requests from frontend`);
});
