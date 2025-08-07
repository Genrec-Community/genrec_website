const express = require('express');
const { body, validationResult } = require('express-validator');
const Feedback = require('../models/Feedback');
const Conversation = require('../models/Conversation');
const { logger } = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateFeedback = [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('rating').isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
  body('feedbackText').optional().isLength({ max: 1000 }).withMessage('Feedback text must be less than 1000 characters'),
  body('messageId').optional().isString(),
  body('userEmail').optional().isEmail().withMessage('Valid email required'),
];

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

// @route   POST /api/feedback
// @desc    Submit feedback for a conversation
// @access  Public
router.post('/', validateFeedback, handleValidationErrors, async (req, res) => {
  try {
    const { sessionId, rating, feedbackText, messageId, userEmail } = req.body;

    // Find conversation
    const conversation = await Conversation.findBySessionId(sessionId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      conversationId: conversation.id,
      messageId,
      rating,
      feedbackText,
      userEmail: userEmail || conversation.user_email
    });

    logger.info('New feedback received', { 
      sessionId, 
      rating, 
      hasText: !!feedbackText,
      userEmail: userEmail || conversation.user_email
    });

    res.status(201).json({
      success: true,
      data: feedback,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    logger.error('Error creating feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
});

// @route   GET /api/feedback/:id
// @desc    Get feedback by ID
// @access  Private (Admin only - will add auth later)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found'
      });
    }

    res.json({
      success: true,
      data: feedback
    });

  } catch (error) {
    logger.error('Error getting feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get feedback'
    });
  }
});

// @route   GET /api/feedback/conversation/:sessionId
// @desc    Get feedback for a specific conversation
// @access  Public
router.get('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Find conversation
    const conversation = await Conversation.findBySessionId(sessionId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const feedback = await Feedback.getByConversation(conversation.id);

    res.json({
      success: true,
      data: feedback
    });

  } catch (error) {
    logger.error('Error getting conversation feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversation feedback'
    });
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback
// @access  Private (Admin only - will add auth later)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Feedback.delete(id);
    if (!result.deleted) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found'
      });
    }

    logger.info('Feedback deleted', { id });

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete feedback'
    });
  }
});

module.exports = router;
