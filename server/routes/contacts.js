const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { logger } = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateContact = [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('company').optional().isLength({ max: 100 }).withMessage('Company name must be less than 100 characters'),
  body('projectType').optional().isLength({ max: 50 }).withMessage('Project type must be less than 50 characters'),
  body('budget').optional().isLength({ max: 50 }).withMessage('Budget must be less than 50 characters'),
  body('timeline').optional().isLength({ max: 50 }).withMessage('Timeline must be less than 50 characters'),
  body('message').notEmpty().withMessage('Message is required').isLength({ max: 2000 }).withMessage('Message must be less than 2000 characters'),
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

// @route   POST /api/contacts
// @desc    Create a new contact submission
// @access  Public
router.post('/', validateContact, handleValidationErrors, async (req, res) => {
  try {
    const contactData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      projectType: req.body.projectType,
      budget: req.body.budget,
      timeline: req.body.timeline,
      message: req.body.message
    };

    const contact = await Contact.create(contactData);

    logger.info('New contact submission received', { 
      email: contact.email, 
      name: contact.name,
      projectType: contact.project_type 
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Contact submission received successfully'
    });

  } catch (error) {
    logger.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form'
    });
  }
});

// @route   GET /api/contacts/:id
// @desc    Get contact by ID
// @access  Private (Admin only - will add auth later)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    logger.error('Error getting contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get contact'
    });
  }
});

// @route   PUT /api/contacts/:id/status
// @desc    Update contact status
// @access  Private (Admin only - will add auth later)
router.put('/:id/status', [
  body('status').isIn(['new', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const contact = await Contact.updateStatus(id, status, notes);
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    logger.info('Contact status updated', { id, status });

    res.json({
      success: true,
      data: contact,
      message: 'Contact status updated successfully'
    });

  } catch (error) {
    logger.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact status'
    });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete contact
// @access  Private (Admin only - will add auth later)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Contact.delete(id);
    if (!result.deleted) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    logger.info('Contact deleted', { id });

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contact'
    });
  }
});

module.exports = router;
