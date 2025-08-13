const express = require('express');
const { query, validationResult } = require('express-validator');
const Conversation = require('../models/Conversation');
const Contact = require('../models/Contact');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const { logger } = require('../utils/logger');

const router = express.Router();

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Query validation middleware
const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// @route   GET /api/admin/dashboard
// @desc    Get dashboard overview data
// @access  Private (Admin only - will add auth later)
router.get('/dashboard', async (req, res) => {
  try {
    const [
      conversationStats,
      contactStats,
      feedbackStats,
      userStats
    ] = await Promise.all([
      Conversation.getStats(),
      Contact.getStats(),
      Feedback.getStats(),
      User.getStats()
    ]);

    const dashboardData = {
      conversations: conversationStats,
      contacts: contactStats,
      feedback: feedbackStats,
      users: userStats,
      summary: {
        total_interactions: conversationStats.total_conversations + contactStats.total_contacts,
        today_activity: conversationStats.today_conversations + contactStats.today_contacts,
        customer_satisfaction: feedbackStats.average_rating ? Math.round(feedbackStats.average_rating * 10) / 10 : 0
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    logger.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard data'
    });
  }
});

// @route   GET /api/admin/conversations
// @desc    Get all conversations with pagination and filters
// @access  Private (Admin only)
router.get('/conversations', validatePagination, handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const filters = {};
    if (req.query.userEmail) filters.userEmail = req.query.userEmail;
    if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom;
    if (req.query.dateTo) filters.dateTo = req.query.dateTo;

    const conversations = await Conversation.getAll(limit, offset, filters);

    res.json({
      success: true,
      data: conversations,
      pagination: {
        page,
        limit,
        total: conversations.length,
        hasMore: conversations.length === limit
      }
    });

  } catch (error) {
    logger.error('Error getting conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversations'
    });
  }
});

// @route   GET /api/admin/contacts
// @desc    Get all contacts with pagination and filters
// @access  Private (Admin only)
router.get('/contacts', validatePagination, handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.email) filters.email = req.query.email;
    if (req.query.company) filters.company = req.query.company;
    if (req.query.projectType) filters.projectType = req.query.projectType;
    if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom;
    if (req.query.dateTo) filters.dateTo = req.query.dateTo;

    const contacts = await Contact.getAll(limit, offset, filters);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total: contacts.length,
        hasMore: contacts.length === limit
      }
    });

  } catch (error) {
    logger.error('Error getting contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get contacts'
    });
  }
});

// @route   GET /api/admin/feedback
// @desc    Get all feedback with pagination and filters
// @access  Private (Admin only)
router.get('/feedback', validatePagination, handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const filters = {};
    if (req.query.rating) filters.rating = parseInt(req.query.rating);
    if (req.query.minRating) filters.minRating = parseInt(req.query.minRating);
    if (req.query.maxRating) filters.maxRating = parseInt(req.query.maxRating);
    if (req.query.userEmail) filters.userEmail = req.query.userEmail;
    if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom;
    if (req.query.dateTo) filters.dateTo = req.query.dateTo;

    const feedback = await Feedback.getAll(limit, offset, filters);

    res.json({
      success: true,
      data: feedback,
      pagination: {
        page,
        limit,
        total: feedback.length,
        hasMore: feedback.length === limit
      }
    });

  } catch (error) {
    logger.error('Error getting feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get feedback'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', validatePagination, handleValidationErrors, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const users = await User.getAll(limit, offset);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: users.length,
        hasMore: users.length === limit
      }
    });

  } catch (error) {
    logger.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users'
    });
  }
});

module.exports = router;
