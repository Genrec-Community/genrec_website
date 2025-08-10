const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Simple logger
const logger = {
  info: (msg, data) => console.log(`[INFO] ${msg}`, data || ''),
  error: (msg, data) => console.error(`[ERROR] ${msg}`, data || ''),
  warn: (msg, data) => console.warn(`[WARN] ${msg}`, data || '')
};

// Simple in-memory storage for now
let contacts = [];
let conversations = [];
let feedback = [];
let interactions = [];

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Critical fix for form submission failures
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Additional CORS headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Contact form endpoint
app.post('/api/contacts', (req, res) => {
  try {
    const contactData = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };

    contacts.push(contactData);
    logger.info('Contact received:', contactData);

    res.status(201).json({
      success: true,
      data: contactData,
      message: 'Contact submission received successfully'
    });
  } catch (error) {
    logger.error('Contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form'
    });
  }
});

// Feedback endpoint
app.post('/api/feedback', (req, res) => {
  try {
    const feedbackData = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };

    feedback.push(feedbackData);
    logger.info('Feedback received:', feedbackData);

    res.status(201).json({
      success: true,
      data: feedbackData,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    logger.error('Feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
});

// Conversation endpoint
app.post('/api/conversations', (req, res) => {
  try {
    const conversationData = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };

    conversations.push(conversationData);
    logger.info('Conversation created:', conversationData);

    res.status(201).json({
      success: true,
      data: conversationData,
      message: 'Conversation created successfully'
    });
  } catch (error) {
    logger.error('Conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation'
    });
  }
});

// Message endpoint
app.post('/api/conversations/message', (req, res) => {
  try {
    const messageData = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };

    // Find conversation and add message
    const conversation = conversations.find(c => c.sessionId === req.body.sessionId);
    if (conversation) {
      if (!conversation.messages) conversation.messages = [];
      conversation.messages.push(messageData);
    }

    logger.info('Message added:', messageData);

    res.status(201).json({
      success: true,
      data: messageData,
      message: 'Message added successfully'
    });
  } catch (error) {
    logger.error('Message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add message'
    });
  }
});

// Newsletter subscription endpoint
app.post('/api/interactions/email', (req, res) => {
  try {
    const interactionData = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };

    interactions.push(interactionData);
    logger.info('Email interaction:', interactionData);

    res.status(201).json({
      success: true,
      data: interactionData,
      message: req.body.source === 'newsletter_subscription'
        ? 'Newsletter subscription successful'
        : 'Email interaction saved successfully'
    });
  } catch (error) {
    logger.error('Email interaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process email interaction'
    });
  }
});

// Analytics tracking endpoint
app.post('/api/analytics/track', (req, res) => {
  try {
    const trackingData = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };

    interactions.push(trackingData);
    logger.info('Interaction tracked:', trackingData);

    res.status(201).json({
      success: true,
      message: 'Interaction tracked successfully'
    });
  } catch (error) {
    logger.error('Tracking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track interaction'
    });
  }
});

// Admin dashboard endpoint
app.get('/api/admin/dashboard', (req, res) => {
  try {
    const dashboardData = {
      conversations: {
        total_conversations: conversations.length,
        today_conversations: conversations.filter(c =>
          new Date(c.created_at).toDateString() === new Date().toDateString()
        ).length
      },
      contacts: {
        total_contacts: contacts.length,
        today_contacts: contacts.filter(c =>
          new Date(c.created_at).toDateString() === new Date().toDateString()
        ).length,
        new_contacts: contacts.length,
        in_progress_contacts: 0,
        completed_contacts: 0
      },
      feedback: {
        total_feedback: feedback.length,
        average_rating: feedback.length > 0
          ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length
          : 0,
        positive_feedback: feedback.filter(f => f.rating >= 8).length,
        negative_feedback: feedback.filter(f => f.rating <= 5).length,
        with_comments: feedback.filter(f => f.feedbackText).length
      },
      users: {
        total_users: new Set(contacts.map(c => c.email)).size,
        new_today: contacts.filter(c =>
          new Date(c.created_at).toDateString() === new Date().toDateString()
        ).length
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    logger.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard data'
    });
  }
});

// Get all data endpoints for admin
app.get('/api/admin/contacts', (req, res) => {
  res.json({ success: true, data: contacts });
});

app.get('/api/admin/conversations', (req, res) => {
  res.json({ success: true, data: conversations });
});

app.get('/api/admin/feedback', (req, res) => {
  res.json({ success: true, data: feedback });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Genrec AI Backend Server',
    version: '1.0.0',
    status: 'Running',
    data_stored: {
      contacts: contacts.length,
      conversations: conversations.length,
      feedback: feedback.length,
      interactions: interactions.length
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Genrec AI Backend Server running on port ${PORT}`);
  logger.info(`📊 Data will be stored in memory`);
  logger.info(`🔗 Frontend URL: http://localhost:3000`);
});

module.exports = app;
