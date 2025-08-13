const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const { logger } = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateConversation = [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('userEmail').optional().isEmail().withMessage('Valid email is required'),
  body('userName').optional().isLength({ min: 1, max: 100 }).withMessage('Name must be 1-100 characters'),
];

const validateMessage = [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('messageId').optional().isString(),
  body('sender').isIn(['user', 'bot']).withMessage('Sender must be user or bot'),
  body('content').notEmpty().withMessage('Message content is required'),
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

// @route   POST /api/conversations
// @desc    Create a new conversation
// @access  Public
router.post('/', validateConversation, handleValidationErrors, async (req, res) => {
  try {
    const { sessionId, userEmail, userName } = req.body;
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip;

    // Check if conversation already exists
    const existingConversation = await Conversation.findBySessionId(sessionId);
    if (existingConversation) {
      return res.status(200).json({
        success: true,
        data: existingConversation,
        message: 'Conversation already exists'
      });
    }

    // Create or update user if email provided
    if (userEmail) {
      await User.create({ email: userEmail, name: userName });
    }

    // Create conversation
    const conversation = await Conversation.create({
      sessionId,
      userEmail,
      userName,
      userAgent,
      ipAddress
    });

    logger.info('New conversation created', { sessionId, userEmail });

    res.status(201).json({
      success: true,
      data: conversation,
      message: 'Conversation created successfully'
    });

  } catch (error) {
    logger.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation'
    });
  }
});

// @route   POST /api/conversations/message
// @desc    Add a message to conversation
// @access  Public
router.post('/message', validateMessage, handleValidationErrors, async (req, res) => {
  try {
    const { sessionId, messageId, sender, content } = req.body;

    // Find or create conversation
    let conversation = await Conversation.findBySessionId(sessionId);
    if (!conversation) {
      conversation = await Conversation.create({
        sessionId,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      });
    }

    // Add message
    const message = await Conversation.addMessage(conversation.id, {
      messageId,
      sender,
      content
    });

    logger.debug('Message added to conversation', { sessionId, sender, messageId });

    res.status(201).json({
      success: true,
      data: message,
      message: 'Message added successfully'
    });

  } catch (error) {
    logger.error('Error adding message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add message'
    });
  }
});

// @route   GET /api/conversations/:sessionId
// @desc    Get conversation by session ID
// @access  Public
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await Conversation.findBySessionId(sessionId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const messages = await Conversation.getMessages(conversation.id);

    res.json({
      success: true,
      data: {
        conversation,
        messages
      }
    });

  } catch (error) {
    logger.error('Error getting conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversation'
    });
  }
});

// @route   GET /api/conversations/:sessionId/messages
// @desc    Get messages for a conversation
// @access  Public
router.get('/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await Conversation.findBySessionId(sessionId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const messages = await Conversation.getMessages(conversation.id);

    res.json({
      success: true,
      data: messages
    });

  } catch (error) {
    logger.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get messages'
    });
  }
});

// @route   PUT /api/conversations/:sessionId/end
// @desc    End a conversation
// @access  Public
router.put('/:sessionId/end', async (req, res) => {
  try {
    const { sessionId } = req.params;

    await Conversation.endConversation(sessionId);

    logger.info('Conversation ended', { sessionId });

    res.json({
      success: true,
      message: 'Conversation ended successfully'
    });

  } catch (error) {
    logger.error('Error ending conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to end conversation'
    });
  }
});

module.exports = router;
