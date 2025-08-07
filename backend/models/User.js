const { getDatabase } = require('../config/database');
const { logger } = require('../utils/logger');

class User {
  static async create(userData) {
    const db = getDatabase();
    const { email, name, phone, company } = userData;

    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO users (email, name, phone, company, first_visit, last_visit, visit_count)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
      `;

      db.run(sql, [email, name, phone, company], function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            // User already exists, update visit info
            User.updateVisit(email)
              .then(user => resolve(user))
              .catch(reject);
          } else {
            logger.error('Error creating user:', err);
            reject(err);
          }
        } else {
          resolve({
            id: this.lastID,
            email,
            name,
            phone,
            company,
            visit_count: 1
          });
        }
      });
    });
  }

  static async findByEmail(email) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      
      db.get(sql, [email], (err, row) => {
        if (err) {
          logger.error('Error finding user by email:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async updateVisit(email) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE users 
        SET last_visit = CURRENT_TIMESTAMP, 
            visit_count = visit_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE email = ?
      `;

      db.run(sql, [email], function(err) {
        if (err) {
          logger.error('Error updating user visit:', err);
          reject(err);
        } else {
          User.findByEmail(email)
            .then(user => resolve(user))
            .catch(reject);
        }
      });
    });
  }

  static async getAll(limit = 100, offset = 0) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM users 
        ORDER BY last_visit DESC 
        LIMIT ? OFFSET ?
      `;

      db.all(sql, [limit, offset], (err, rows) => {
        if (err) {
          logger.error('Error getting all users:', err);
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
          COUNT(*) as total_users,
          COUNT(CASE WHEN date(first_visit) = date('now') THEN 1 END) as new_today,
          COUNT(CASE WHEN date(last_visit) = date('now') THEN 1 END) as active_today,
          AVG(visit_count) as avg_visits
        FROM users
      `;

      db.get(sql, [], (err, row) => {
        if (err) {
          logger.error('Error getting user stats:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = User;
