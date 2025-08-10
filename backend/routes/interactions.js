const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../config/database');
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

// @route   POST /api/interactions/email
// @desc    Track email interactions and newsletter subscriptions
// @access  Public
router.post('/email', [
  body('email').isEmail().withMessage('Valid email required'),
  body('source').notEmpty().withMessage('Source is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { email, source } = req.body;
    const db = getDatabase();

    // For newsletter subscriptions, also save to contacts table
    if (source === 'newsletter_subscription') {
      const contactSql = `
        INSERT INTO contacts (
          name, email, message, status, created_at
        ) VALUES (?, ?, ?, 'new', CURRENT_TIMESTAMP)
      `;

      db.run(contactSql, ['Newsletter Subscriber', email, 'Newsletter subscription'], function(contactErr) {
        if (contactErr && contactErr.code !== 'SQLITE_CONSTRAINT_UNIQUE') {
          logger.error('Error saving newsletter subscription to contacts:', contactErr);
        }
      });
    }

    // Save to analytics
    const sql = `
      INSERT INTO analytics (event_type, event_data, ip_address, user_agent, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    const eventData = JSON.stringify({
      email,
      source,
      action: 'email_interaction'
    });

    db.run(sql, ['email_interaction', eventData, req.ip, req.get('User-Agent')], function(err) {
      if (err) {
        logger.error('Error saving email interaction:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to save email interaction'
        });
      }

      logger.info('Email interaction saved', { email, source });

      res.status(201).json({
        success: true,
        message: source === 'newsletter_subscription'
          ? 'Newsletter subscription successful'
          : 'Email interaction saved successfully'
      });
    });

  } catch (error) {
    logger.error('Error processing email interaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process email interaction'
    });
  }
});

// @route   POST /api/interactions/download
// @desc    Track download interactions
// @access  Public
router.post('/download', [
  body('downloadType').notEmpty().withMessage('Download type is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { downloadType, userInfo } = req.body;
    const db = getDatabase();

    const sql = `
      INSERT INTO analytics (event_type, event_data, ip_address, user_agent, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    const eventData = JSON.stringify({
      downloadType,
      userInfo,
      action: 'download_interaction'
    });

    db.run(sql, ['download_interaction', eventData, req.ip, req.get('User-Agent')], function(err) {
      if (err) {
        logger.error('Error saving download interaction:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to save download interaction'
        });
      }

      logger.info('Download interaction saved', { downloadType });

      res.status(201).json({
        success: true,
        message: 'Download interaction saved successfully'
      });
    });

  } catch (error) {
    logger.error('Error processing download interaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process download interaction'
    });
  }
});

// @route   POST /api/interactions/navigation
// @desc    Track navigation interactions
// @access  Public
router.post('/navigation', [
  body('page').notEmpty().withMessage('Page is required'),
  body('action').notEmpty().withMessage('Action is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { page, action, details } = req.body;
    const db = getDatabase();

    const sql = `
      INSERT INTO analytics (event_type, event_data, ip_address, user_agent, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    const eventData = JSON.stringify({
      page,
      action,
      details,
      action_type: 'navigation_interaction'
    });

    db.run(sql, ['navigation_interaction', eventData, req.ip, req.get('User-Agent')], function(err) {
      if (err) {
        logger.error('Error saving navigation interaction:', err);
        return res.status(500).json({
          success: false,
          error: 'Failed to save navigation interaction'
        });
      }

      logger.info('Navigation interaction saved', { page, action });

      res.status(201).json({
        success: true,
        message: 'Navigation interaction saved successfully'
      });
    });

  } catch (error) {
    logger.error('Error processing navigation interaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process navigation interaction'
    });
  }
});

module.exports = router;
