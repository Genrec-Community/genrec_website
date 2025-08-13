// SQLite Backend - Single database file (no PostgreSQL needed)
const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const url = require('url');

const PORT = 5000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'genrec.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`📁 Created data directory: ${DATA_DIR}`);
}

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log(`✅ Connected to SQLite database: ${DB_PATH}`);
  }
});

// Create tables
db.serialize(() => {
  // Contacts table
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    project_type TEXT,
    budget TEXT,
    timeline TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Feedback table
  db.run(`CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    feedback_text TEXT,
    user_email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Conversations table
  db.run(`CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    user_email TEXT,
    user_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Messages table
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    message_id TEXT,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Analytics table
  db.run(`CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    event_data TEXT,
    user_email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  console.log('✅ Database tables initialized');
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// Helper functions
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, corsHeaders);
  res.end(JSON.stringify(data));
}

const log = (msg, data) => console.log(`[${new Date().toISOString()}] ${msg}`, data || '');

// Create server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  log(`${method} ${path}`);

  try {
    // Health check
    if (path === '/health' && method === 'GET') {
      sendJSON(res, 200, {
        status: 'OK',
        timestamp: new Date().toISOString(),
        storage: 'SQLite Database',
        database_file: DB_PATH,
        database_size: fs.statSync(DB_PATH).size + ' bytes'
      });
      return;
    }

    // Contact form
    if (path === '/api/contacts' && method === 'POST') {
      const body = await parseBody(req);
      const { name, email, phone, company, projectType, budget, timeline, message } = body;
      
      db.run(`INSERT INTO contacts (name, email, phone, company, project_type, budget, timeline, message) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, phone, company, projectType, budget, timeline, message],
        function(err) {
          if (err) {
            log('❌ Error saving contact:', err.message);
            sendJSON(res, 500, { success: false, error: 'Failed to save contact' });
          } else {
            log('💾 Contact saved to SQLite:', email);
            sendJSON(res, 201, {
              success: true,
              data: { id: this.lastID, ...body },
              message: 'Contact submitted and saved to database'
            });
          }
        });
      return;
    }

    // Feedback
    if (path === '/api/feedback' && method === 'POST') {
      const body = await parseBody(req);
      const { sessionId, rating, feedbackText, userEmail } = body;
      
      db.run(`INSERT INTO feedback (session_id, rating, feedback_text, user_email) 
              VALUES (?, ?, ?, ?)`,
        [sessionId, rating, feedbackText, userEmail],
        function(err) {
          if (err) {
            log('❌ Error saving feedback:', err.message);
            sendJSON(res, 500, { success: false, error: 'Failed to save feedback' });
          } else {
            log('💾 Feedback saved to SQLite:', `Rating: ${rating}`);
            sendJSON(res, 201, {
              success: true,
              data: { id: this.lastID, ...body },
              message: 'Feedback submitted and saved to database'
            });
          }
        });
      return;
    }

    // Newsletter/Email interactions
    if (path === '/api/interactions/email' && method === 'POST') {
      const body = await parseBody(req);
      const { email, source } = body;
      
      db.run(`INSERT INTO analytics (event_type, event_data, user_email) 
              VALUES (?, ?, ?)`,
        ['email_interaction', JSON.stringify({ email, source }), email],
        function(err) {
          if (err) {
            log('❌ Error saving email interaction:', err.message);
            sendJSON(res, 500, { success: false, error: 'Failed to save interaction' });
          } else {
            log('💾 Email interaction saved to SQLite:', `${email} - ${source}`);
            sendJSON(res, 201, {
              success: true,
              data: { id: this.lastID, ...body },
              message: source === 'newsletter_subscription' 
                ? 'Newsletter subscription saved to database' 
                : 'Email interaction saved to database'
            });
          }
        });
      return;
    }

    // Conversations
    if (path === '/api/conversations' && method === 'POST') {
      const body = await parseBody(req);
      const { sessionId, userEmail, userName } = body;
      
      db.run(`INSERT OR IGNORE INTO conversations (session_id, user_email, user_name) 
              VALUES (?, ?, ?)`,
        [sessionId, userEmail, userName],
        function(err) {
          if (err) {
            log('❌ Error saving conversation:', err.message);
            sendJSON(res, 500, { success: false, error: 'Failed to save conversation' });
          } else {
            log('💾 Conversation saved to SQLite:', sessionId);
            sendJSON(res, 201, {
              success: true,
              data: { id: this.lastID, ...body },
              message: 'Conversation created and saved to database'
            });
          }
        });
      return;
    }

    // Messages
    if (path === '/api/conversations/message' && method === 'POST') {
      const body = await parseBody(req);
      const { sessionId, messageId, sender, content } = body;
      
      db.run(`INSERT INTO messages (session_id, message_id, sender, content) 
              VALUES (?, ?, ?, ?)`,
        [sessionId, messageId, sender, content],
        function(err) {
          if (err) {
            log('❌ Error saving message:', err.message);
            sendJSON(res, 500, { success: false, error: 'Failed to save message' });
          } else {
            log('💾 Message saved to SQLite:', `${sender}: ${content.substring(0, 50)}...`);
            sendJSON(res, 201, {
              success: true,
              data: { id: this.lastID, ...body },
              message: 'Message added and saved to database'
            });
          }
        });
      return;
    }

    // Analytics tracking
    if (path === '/api/analytics/track' && method === 'POST') {
      const body = await parseBody(req);
      const { action, details, source } = body;
      
      db.run(`INSERT INTO analytics (event_type, event_data) 
              VALUES (?, ?)`,
        ['user_interaction', JSON.stringify({ action, details, source })],
        function(err) {
          if (err) {
            log('❌ Error tracking interaction:', err.message);
            sendJSON(res, 500, { success: false, error: 'Failed to track interaction' });
          } else {
            log('💾 Interaction tracked in SQLite:', action);
            sendJSON(res, 201, {
              success: true,
              message: 'Interaction tracked and saved to database'
            });
          }
        });
      return;
    }

    // Admin endpoints
    if (path === '/api/admin/contacts' && method === 'GET') {
      db.all(`SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100`, (err, rows) => {
        if (err) {
          sendJSON(res, 500, { success: false, error: 'Failed to get contacts' });
        } else {
          sendJSON(res, 200, { 
            success: true, 
            data: rows, 
            count: rows.length,
            database_file: DB_PATH
          });
        }
      });
      return;
    }

    if (path === '/api/admin/feedback' && method === 'GET') {
      db.all(`SELECT * FROM feedback ORDER BY created_at DESC LIMIT 100`, (err, rows) => {
        if (err) {
          sendJSON(res, 500, { success: false, error: 'Failed to get feedback' });
        } else {
          sendJSON(res, 200, { 
            success: true, 
            data: rows, 
            count: rows.length,
            database_file: DB_PATH
          });
        }
      });
      return;
    }

    if (path === '/api/admin/dashboard' && method === 'GET') {
      // Get dashboard statistics
      db.all(`
        SELECT 
          (SELECT COUNT(*) FROM contacts) as total_contacts,
          (SELECT COUNT(*) FROM feedback) as total_feedback,
          (SELECT COUNT(*) FROM conversations) as total_conversations,
          (SELECT AVG(rating) FROM feedback) as avg_rating,
          (SELECT COUNT(*) FROM contacts WHERE date(created_at) = date('now')) as today_contacts
      `, (err, rows) => {
        if (err) {
          sendJSON(res, 500, { success: false, error: 'Failed to get dashboard data' });
        } else {
          const stats = rows[0];
          sendJSON(res, 200, {
            success: true,
            data: {
              storage: {
                type: 'SQLite Database',
                file: DB_PATH,
                size: fs.statSync(DB_PATH).size + ' bytes'
              },
              contacts: {
                total_contacts: stats.total_contacts,
                today_contacts: stats.today_contacts,
                new_contacts: stats.total_contacts,
                in_progress_contacts: 0,
                completed_contacts: 0
              },
              feedback: {
                total_feedback: stats.total_feedback,
                average_rating: stats.avg_rating || 0,
                positive_feedback: 0,
                negative_feedback: 0,
                with_comments: 0
              },
              conversations: {
                total_conversations: stats.total_conversations,
                today_conversations: 0
              },
              users: {
                total_users: 0,
                new_today: 0
              }
            }
          });
        }
      });
      return;
    }

    // Root endpoint
    if (path === '/' && method === 'GET') {
      db.all(`
        SELECT 
          (SELECT COUNT(*) FROM contacts) as contacts,
          (SELECT COUNT(*) FROM feedback) as feedback,
          (SELECT COUNT(*) FROM conversations) as conversations,
          (SELECT COUNT(*) FROM analytics) as analytics
      `, (err, rows) => {
        const stats = rows ? rows[0] : { contacts: 0, feedback: 0, conversations: 0, analytics: 0 };
        sendJSON(res, 200, {
          message: 'Genrec AI Backend - SQLite Database',
          status: 'Running',
          storage: {
            type: 'SQLite Database',
            file: DB_PATH,
            size: fs.existsSync(DB_PATH) ? fs.statSync(DB_PATH).size + ' bytes' : '0 bytes'
          },
          data_count: stats,
          data_access: {
            view_database: `Open ${DB_PATH} with SQLite browser`,
            api_contacts: '/api/admin/contacts',
            api_feedback: '/api/admin/feedback',
            api_dashboard: '/api/admin/dashboard'
          }
        });
      });
      return;
    }

    // 404 for other routes
    sendJSON(res, 404, {
      success: false,
      error: 'Endpoint not found'
    });

  } catch (error) {
    log('Server error:', error.message);
    sendJSON(res, 500, {
      success: false,
      error: 'Internal server error'
    });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Genrec AI Backend (SQLite) running on http://localhost:${PORT}`);
  console.log(`🗄️  Database file: ${DB_PATH}`);
  console.log(`📊 Database size: ${fs.existsSync(DB_PATH) ? fs.statSync(DB_PATH).size : 0} bytes`);
  console.log(`\n✅ All data persists in single database file!`);
  console.log(`🔍 View database: Use SQLite browser or DB Browser for SQLite`);
  console.log(`🌐 View data online: http://localhost:${PORT}/api/admin/dashboard`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n💾 Closing database connection...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err.message);
    } else {
      console.log('✅ Database connection closed successfully!');
      console.log(`📁 Database file saved: ${DB_PATH}`);
    }
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err.message);
  db.close();
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err.message);
});
