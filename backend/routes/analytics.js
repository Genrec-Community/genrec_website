const express = require('express');
const Contact = require('../models/Contact');
const Feedback = require('../models/Feedback');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const { logger } = require('../utils/logger');

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get analytics overview
// @access  Private (Admin only)
router.get('/overview', async (req, res) => {
  try {
    const [
      conversationStats,
      contactStats,
      feedbackStats,
      userStats,
      projectTypeStats,
      budgetStats,
      ratingDistribution
    ] = await Promise.all([
      Conversation.getStats(),
      Contact.getStats(),
      Feedback.getStats(),
      User.getStats(),
      Contact.getProjectTypeStats(),
      Contact.getBudgetStats(),
      Feedback.getRatingDistribution()
    ]);

    const analytics = {
      overview: {
        total_conversations: conversationStats.total_conversations,
        total_contacts: contactStats.total_contacts,
        total_feedback: feedbackStats.total_feedback,
        total_users: userStats.total_users,
        average_rating: feedbackStats.average_rating,
        conversion_rate: contactStats.total_contacts > 0 
          ? Math.round((contactStats.total_contacts / conversationStats.total_conversations) * 100 * 100) / 100
          : 0
      },
      trends: {
        today: {
          conversations: conversationStats.today_conversations,
          contacts: contactStats.today_contacts,
          feedback: feedbackStats.today_feedback,
          new_users: userStats.new_today
        },
        week: {
          contacts: contactStats.week_contacts,
          feedback: feedbackStats.week_feedback
        }
      },
      satisfaction: {
        average_rating: feedbackStats.average_rating,
        positive_feedback: feedbackStats.positive_feedback,
        negative_feedback: feedbackStats.negative_feedback,
        rating_distribution: ratingDistribution
      },
      business: {
        project_types: projectTypeStats,
        budget_distribution: budgetStats,
        contact_status: {
          new: contactStats.new_contacts,
          in_progress: contactStats.in_progress_contacts,
          completed: contactStats.completed_contacts
        }
      }
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    logger.error('Error getting analytics overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get analytics overview'
    });
  }
});

// @route   GET /api/analytics/feedback
// @desc    Get detailed feedback analytics
// @access  Private (Admin only)
router.get('/feedback', async (req, res) => {
  try {
    const [
      feedbackStats,
      ratingDistribution,
      recentFeedback
    ] = await Promise.all([
      Feedback.getStats(),
      Feedback.getRatingDistribution(),
      Feedback.getRecentFeedback(10)
    ]);

    const feedbackAnalytics = {
      summary: feedbackStats,
      rating_distribution: ratingDistribution,
      recent_feedback: recentFeedback,
      insights: {
        satisfaction_score: feedbackStats.average_rating ? Math.round(feedbackStats.average_rating * 10) / 10 : 0,
        positive_percentage: feedbackStats.total_feedback > 0 
          ? Math.round((feedbackStats.positive_feedback / feedbackStats.total_feedback) * 100)
          : 0,
        response_rate: feedbackStats.total_feedback > 0 
          ? Math.round((feedbackStats.with_comments / feedbackStats.total_feedback) * 100)
          : 0
      }
    };

    res.json({
      success: true,
      data: feedbackAnalytics
    });

  } catch (error) {
    logger.error('Error getting feedback analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get feedback analytics'
    });
  }
});

// @route   GET /api/analytics/contacts
// @desc    Get detailed contact analytics
// @access  Private (Admin only)
router.get('/contacts', async (req, res) => {
  try {
    const [
      contactStats,
      projectTypeStats,
      budgetStats
    ] = await Promise.all([
      Contact.getStats(),
      Contact.getProjectTypeStats(),
      Contact.getBudgetStats()
    ]);

    const contactAnalytics = {
      summary: contactStats,
      project_types: projectTypeStats,
      budget_distribution: budgetStats,
      insights: {
        completion_rate: contactStats.total_contacts > 0 
          ? Math.round((contactStats.completed_contacts / contactStats.total_contacts) * 100)
          : 0,
        pending_rate: contactStats.total_contacts > 0 
          ? Math.round(((contactStats.new_contacts + contactStats.in_progress_contacts) / contactStats.total_contacts) * 100)
          : 0,
        most_popular_project: projectTypeStats.length > 0 ? projectTypeStats[0].project_type : 'N/A',
        most_popular_budget: budgetStats.length > 0 ? budgetStats[0].budget : 'N/A'
      }
    };

    res.json({
      success: true,
      data: contactAnalytics
    });

  } catch (error) {
    logger.error('Error getting contact analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get contact analytics'
    });
  }
});

// @route   GET /api/analytics/export
// @desc    Export analytics data as CSV
// @access  Private (Admin only)
router.get('/export', async (req, res) => {
  try {
    const { type = 'all', format = 'json' } = req.query;

    let data = {};

    if (type === 'all' || type === 'contacts') {
      data.contacts = await Contact.getAll(1000, 0);
    }

    if (type === 'all' || type === 'feedback') {
      data.feedback = await Feedback.getAll(1000, 0);
    }

    if (type === 'all' || type === 'conversations') {
      data.conversations = await Conversation.getAll(1000, 0);
    }

    if (format === 'csv') {
      // Simple CSV conversion for contacts
      if (data.contacts) {
        const csvHeaders = 'Name,Email,Company,Project Type,Budget,Status,Created At\n';
        const csvRows = data.contacts.map(contact => 
          `"${contact.name}","${contact.email}","${contact.company || ''}","${contact.project_type || ''}","${contact.budget || ''}","${contact.status}","${contact.created_at}"`
        ).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="genrec-contacts.csv"');
        return res.send(csvHeaders + csvRows);
      }
    }

    res.json({
      success: true,
      data,
      exported_at: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error exporting analytics data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export analytics data'
    });
  }
});

module.exports = router;
