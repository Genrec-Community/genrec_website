const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import Supabase configuration and database service
const { testConnection } = require('./config/supabase');
const db = require('./services/database');

// Simple logger
const logger = {
  info: (msg, data) => console.log(`[INFO] ${msg}`, data || ''),
  error: (msg, data) => console.error(`[ERROR] ${msg}`, data || ''),
  warn: (msg, data) => console.warn(`[WARN] ${msg}`, data || '')
};

// Database will be handled by Supabase service
// Remove in-memory storage

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Updated for production
const isDevelopment = process.env.NODE_ENV !== 'production';
const allowedOrigins = isDevelopment
  ? ['http://localhost:3000', 'http://127.0.0.1:3000']
  : [process.env.FRONTEND_URL || 'http://localhost:5000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import HTTP/2 Server Push middleware, Cache Control middleware, and Compression middleware
const http2ServerPush = require('./middleware/http2ServerPush');
const cacheControl = require('./middleware/cacheControl');
const compressionMiddleware = require('./middleware/compression');

// Apply Compression middleware (should be one of the first middleware)
app.use(compressionMiddleware);

// Apply HTTP/2 Server Push middleware
app.use(http2ServerPush);

// Apply Cache Control middleware
app.use(cacheControl);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../build')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Contact form endpoint
app.post('/api/contacts', async (req, res) => {
  try {
    const contactData = await db.createContact(req.body);
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
app.post('/api/feedback', async (req, res) => {
  try {
    const feedbackData = await db.createFeedback(req.body);
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
app.post('/api/conversations', async (req, res) => {
  try {
    const conversationData = await db.createConversation(req.body);
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
app.post('/api/conversations/message', async (req, res) => {
  try {
    const messageData = await db.addMessage(req.body);
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
app.post('/api/interactions/email', async (req, res) => {
  try {
    const interactionData = await db.createInteraction({
      ...req.body,
      interactionType: 'email_signup'
    });
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
app.post('/api/analytics/track', async (req, res) => {
  try {
    const trackingData = await db.createInteraction({
      ...req.body,
      interactionType: req.body.interactionType || 'page_view'
    });
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
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const dashboardData = await db.getDashboardStats();

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
app.get('/api/admin/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filters = req.query;

    const result = await db.getContacts(page, limit, filters);
    res.json({ success: true, ...result });
  } catch (error) {
    logger.error('Get contacts error:', error);
    res.status(500).json({ success: false, error: 'Failed to get contacts' });
  }
});

app.get('/api/admin/conversations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filters = req.query;

    const result = await db.getConversations(page, limit, filters);
    res.json({ success: true, ...result });
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({ success: false, error: 'Failed to get conversations' });
  }
});

app.get('/api/admin/feedback', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filters = req.query;

    const result = await db.getFeedback(page, limit, filters);
    res.json({ success: true, ...result });
  } catch (error) {
    logger.error('Get feedback error:', error);
    res.status(500).json({ success: false, error: 'Failed to get feedback' });
  }
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  // If it's an API route, let it fall through to 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  // Serve React app
  res.sendFile(path.join(__dirname, '../build/index.html'));
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
app.listen(PORT, async () => {
  logger.info(`🚀 Genrec AI Backend Server running on port ${PORT}`);
  logger.info(`📊 Data will be stored in Supabase`);
  logger.info(`🔗 Frontend URL: http://localhost:3000`);

  // Test Supabase connection
  await testConnection();
});

module.exports = app;
