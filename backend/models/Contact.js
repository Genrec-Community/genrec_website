const { getDatabase } = require('../config/database');
const { logger } = require('../utils/logger');

class Contact {
  static async create(contactData) {
    const db = getDatabase();
    const { 
      name, 
      email, 
      phone, 
      company, 
      projectType, 
      budget, 
      timeline, 
      message 
    } = contactData;

    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO contacts (
          name, email, phone, company, project_type, budget, timeline, message, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
      `;

      db.run(sql, [name, email, phone, company, projectType, budget, timeline, message], function(err) {
        if (err) {
          logger.error('Error creating contact:', err);
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            name,
            email,
            phone,
            company,
            project_type: projectType,
            budget,
            timeline,
            message,
            status: 'new'
          });
        }
      });
    });
  }

  static async findById(id) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM contacts WHERE id = ?';
      
      db.get(sql, [id], (err, row) => {
        if (err) {
          logger.error('Error finding contact by ID:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async updateStatus(id, status, notes = null) {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE contacts 
        SET status = ?, 
            notes = COALESCE(?, notes),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(sql, [status, notes, id], function(err) {
        if (err) {
          logger.error('Error updating contact status:', err);
          reject(err);
        } else {
          Contact.findById(id)
            .then(contact => resolve(contact))
            .catch(reject);
        }
      });
    });
  }

  static async getAll(limit = 50, offset = 0, filters = {}) {
    const db = getDatabase();
    let sql = 'SELECT * FROM contacts';
    
    const conditions = [];
    const params = [];

    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }

    if (filters.email) {
      conditions.push('email LIKE ?');
      params.push(`%${filters.email}%`);
    }

    if (filters.company) {
      conditions.push('company LIKE ?');
      params.push(`%${filters.company}%`);
    }

    if (filters.projectType) {
      conditions.push('project_type = ?');
      params.push(filters.projectType);
    }

    if (filters.dateFrom) {
      conditions.push('date(created_at) >= ?');
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      conditions.push('date(created_at) <= ?');
      params.push(filters.dateTo);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          logger.error('Error getting contacts:', err);
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
          COUNT(*) as total_contacts,
          COUNT(CASE WHEN status = 'new' THEN 1 END) as new_contacts,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_contacts,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_contacts,
          COUNT(CASE WHEN date(created_at) = date('now') THEN 1 END) as today_contacts,
          COUNT(CASE WHEN date(created_at) >= date('now', '-7 days') THEN 1 END) as week_contacts
        FROM contacts
      `;

      db.get(sql, [], (err, row) => {
        if (err) {
          logger.error('Error getting contact stats:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async getProjectTypeStats() {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          project_type,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM contacts), 2) as percentage
        FROM contacts 
        WHERE project_type IS NOT NULL
        GROUP BY project_type
        ORDER BY count DESC
      `;

      db.all(sql, [], (err, rows) => {
        if (err) {
          logger.error('Error getting project type stats:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getBudgetStats() {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          budget,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM contacts), 2) as percentage
        FROM contacts 
        WHERE budget IS NOT NULL
        GROUP BY budget
        ORDER BY 
          CASE budget
            WHEN '$10K - $25K' THEN 1
            WHEN '$25K - $50K' THEN 2
            WHEN '$50K - $100K' THEN 3
            WHEN '$100K - $250K' THEN 4
            WHEN '$250K+' THEN 5
            ELSE 6
          END
      `;

      db.all(sql, [], (err, rows) => {
        if (err) {
          logger.error('Error getting budget stats:', err);
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
      const sql = 'DELETE FROM contacts WHERE id = ?';

      db.run(sql, [id], function(err) {
        if (err) {
          logger.error('Error deleting contact:', err);
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }
}

module.exports = Contact;
