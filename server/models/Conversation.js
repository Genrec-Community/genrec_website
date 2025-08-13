const { getDatabase } = require('../config/database');
const { logger } = require('../utils/logger');

class Conversation {
  static async create(conversationData) {
    const db = getDatabase();
    const { 
      sessionId, 
      userEmail, 
      userName, 
      userAgent, 
      ipAddress 
    } = conversationData;

    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO conversations (
          session_id, user_email, user_name, user_agent, ip_address, start_time
        ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      db.run(sql, [sessionId, userEmail, userName, userAgent, ipAddress], function(err) {
        if (err) {
          logger.error('Error creating conversation:', err);
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            session_id: sessionId,
            user_email: userEmail,
            user_name: userName,
            message_count: 0
          });
        }
      });
    });
  }

  static async findBySessionId(sessionId) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, 
               COUNT(m.id) as message_count
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        WHERE c.session_id = ?
        GROUP BY c.id
      `;
      
      db.get(sql, [sessionId], (err, row) => {
        if (err) {
          logger.error('Error finding conversation by session ID:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async addMessage(conversationId, messageData) {
    const db = getDatabase();
    const { messageId, sender, content } = messageData;

    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO messages (conversation_id, message_id, sender, content, timestamp)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `;

      db.run(sql, [conversationId, messageId, sender, content], function(err) {
        if (err) {
          logger.error('Error adding message:', err);
          reject(err);
        } else {
          // Update conversation message count
          Conversation.updateMessageCount(conversationId)
            .then(() => {
              resolve({
                id: this.lastID,
                conversation_id: conversationId,
                message_id: messageId,
                sender,
                content
              });
            })
            .catch(reject);
        }
      });
    });
  }

  static async updateMessageCount(conversationId) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE conversations 
        SET message_count = (
          SELECT COUNT(*) FROM messages WHERE conversation_id = ?
        ),
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(sql, [conversationId, conversationId], function(err) {
        if (err) {
          logger.error('Error updating message count:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async getMessages(conversationId) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM messages 
        WHERE conversation_id = ? 
        ORDER BY timestamp ASC
      `;

      db.all(sql, [conversationId], (err, rows) => {
        if (err) {
          logger.error('Error getting messages:', err);
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
      SELECT c.*, 
             COUNT(m.id) as message_count,
             MAX(m.timestamp) as last_message_time
      FROM conversations c
      LEFT JOIN messages m ON c.id = m.conversation_id
    `;
    
    const conditions = [];
    const params = [];

    if (filters.userEmail) {
      conditions.push('c.user_email LIKE ?');
      params.push(`%${filters.userEmail}%`);
    }

    if (filters.dateFrom) {
      conditions.push('date(c.start_time) >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('date(c.start_time) <= ?');
      params.push(filters.dateTo);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += `
      GROUP BY c.id
      ORDER BY c.start_time DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error('Error getting conversations:', err);
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
          COUNT(*) as total_conversations,
          COUNT(CASE WHEN date(start_time) = date('now') THEN 1 END) as today_conversations,
          AVG(message_count) as avg_messages_per_conversation,
          MAX(message_count) as max_messages_in_conversation
        FROM conversations
      `;

      db.get(sql, [], (err, row) => {
        if (err) {
          logger.error('Error getting conversation stats:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async endConversation(sessionId) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE conversations 
        SET end_time = CURRENT_TIMESTAMP, 
            status = 'completed',
            updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ?
      `;

      db.run(sql, [sessionId], function(err) {
        if (err) {
          logger.error('Error ending conversation:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Conversation;
