const { getDatabase } = require('../config/database');
const { logger } = require('../utils/logger');

class Feedback {
  static async create(feedbackData) {
    const db = getDatabase();
    const { 
      conversationId, 
      messageId, 
      rating, 
      feedbackText, 
      feedbackType = 'rating',
      userEmail 
    } = feedbackData;

    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO feedback (
          conversation_id, message_id, rating, feedback_text, feedback_type, user_email
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.run(sql, [conversationId, messageId, rating, feedbackText, feedbackType, userEmail], function(err) {
        if (err) {
          logger.error('Error creating feedback:', err);
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            conversation_id: conversationId,
            message_id: messageId,
            rating,
            feedback_text: feedbackText,
            feedback_type: feedbackType,
            user_email: userEmail
          });
        }
      });
    });
  }

  static async findById(id) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT f.*, c.session_id, c.user_name, c.user_email as conversation_email
        FROM feedback f
        LEFT JOIN conversations c ON f.conversation_id = c.id
        WHERE f.id = ?
      `;
      
      db.get(sql, [id], (err, row) => {
        if (err) {
          logger.error('Error finding feedback by ID:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async getByConversation(conversationId) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM feedback 
        WHERE conversation_id = ? 
        ORDER BY created_at DESC
      `;

      db.all(sql, [conversationId], (err, rows) => {
        if (err) {
          logger.error('Error getting feedback by conversation:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getAll(limit = 50, offset = 0, filters = {}) {
    const db = getDatabase();
    let sql = `
      SELECT f.*, c.session_id, c.user_name, c.user_email as conversation_email
      FROM feedback f
      LEFT JOIN conversations c ON f.conversation_id = c.id
    `;
    
    const conditions = [];
    const params = [];

    if (filters.rating) {
      conditions.push('f.rating = ?');
      params.push(filters.rating);
    }

    if (filters.minRating) {
      conditions.push('f.rating >= ?');
      params.push(filters.minRating);
    }

    if (filters.maxRating) {
      conditions.push('f.rating <= ?');
      params.push(filters.maxRating);
    }

    if (filters.feedbackType) {
      conditions.push('f.feedback_type = ?');
      params.push(filters.feedbackType);
    }

    if (filters.userEmail) {
      conditions.push('(f.user_email LIKE ? OR c.user_email LIKE ?)');
      params.push(`%${filters.userEmail}%`, `%${filters.userEmail}%`);
    }

    if (filters.dateFrom) {
      conditions.push('date(f.created_at) >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('date(f.created_at) <= ?');
      params.push(filters.dateTo);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY f.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error('Error getting feedback:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getStats() {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_feedback,
          AVG(rating) as average_rating,
          COUNT(CASE WHEN rating >= 8 THEN 1 END) as positive_feedback,
          COUNT(CASE WHEN rating <= 5 THEN 1 END) as negative_feedback,
          COUNT(CASE WHEN feedback_text IS NOT NULL AND feedback_text != '' THEN 1 END) as with_comments,
          COUNT(CASE WHEN date(created_at) = date('now') THEN 1 END) as today_feedback,
          COUNT(CASE WHEN date(created_at) >= date('now', '-7 days') THEN 1 END) as week_feedback
        FROM feedback
      `;

      db.get(sql, [], (err, row) => {
        if (err) {
          logger.error('Error getting feedback stats:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async getRatingDistribution() {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          rating,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM feedback), 2) as percentage
        FROM feedback 
        GROUP BY rating
        ORDER BY rating DESC
      `;

      db.all(sql, [], (err, rows) => {
        if (err) {
          logger.error('Error getting rating distribution:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getRecentFeedback(limit = 10) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT f.*, c.session_id, c.user_name, c.user_email as conversation_email
        FROM feedback f
        LEFT JOIN conversations c ON f.conversation_id = c.id
        ORDER BY f.created_at DESC
        LIMIT ?
      `;

      db.all(sql, [limit], (err, rows) => {
        if (err) {
          logger.error('Error getting recent feedback:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async delete(id) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM feedback WHERE id = ?';

      db.run(sql, [id], function(err) {
        if (err) {
          logger.error('Error deleting feedback:', err);
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }
}

module.exports = Feedback;
