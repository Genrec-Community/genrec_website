// PostgreSQL Backend Server - Production Ready
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'genrec_ai',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
    console.log('📋 Make sure PostgreSQL is running and credentials are correct');
    process.exit(1);
  } else {
    console.log('✅ Connected to PostgreSQL database');
    release();
  }
});

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Initialize database tables
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        project_type VARCHAR(100),
        budget VARCHAR(100),
        timeline VARCHAR(100),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Conversations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        user_email VARCHAR(255),
        user_name VARCHAR(255),
        user_agent TEXT,
        ip_address INET,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        message_id VARCHAR(255),
        sender VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Feedback table
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        message_id VARCHAR(255),
        rating INTEGER CHECK (rating >= 1 AND rating <= 10),
        feedback_text TEXT,
        user_email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Analytics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        user_email VARCHAR(255),
        session_id VARCHAR(255),
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_feedback_conversation_id ON feedback(conversation_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)`);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Initialize database on startup
initializeDatabase().catch(console.error);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL',
      db_time: result.rows[0].current_time
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: 'Database connection failed'
    });
  }
});

// Contact form endpoint
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone, company, projectType, budget, timeline, message } = req.body;
    
    const result = await pool.query(`
      INSERT INTO contacts (name, email, phone, company, project_type, budget, timeline, message)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [name, email, phone, company, projectType, budget, timeline, message]);

    console.log('✅ Contact saved to PostgreSQL:', email);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Contact submitted successfully'
    });
  } catch (error) {
    console.error('❌ Error saving contact:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form'
    });
  }
});

// Feedback endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { sessionId, rating, feedbackText, messageId, userEmail } = req.body;
    
    // Find conversation
    const convResult = await pool.query('SELECT id FROM conversations WHERE session_id = $1', [sessionId]);
    let conversationId = null;
    
    if (convResult.rows.length > 0) {
      conversationId = convResult.rows[0].id;
    }

    const result = await pool.query(`
      INSERT INTO feedback (conversation_id, message_id, rating, feedback_text, user_email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [conversationId, messageId, rating, feedbackText, userEmail]);

    console.log('✅ Feedback saved to PostgreSQL:', `Rating: ${rating}`);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('❌ Error saving feedback:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
});

// Conversation endpoint
app.post('/api/conversations', async (req, res) => {
  try {
    const { sessionId, userEmail, userName } = req.body;
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip;

    // Check if conversation exists
    const existing = await pool.query('SELECT * FROM conversations WHERE session_id = $1', [sessionId]);
    
    if (existing.rows.length > 0) {
      return res.json({
        success: true,
        data: existing.rows[0],
        message: 'Conversation already exists'
      });
    }

    const result = await pool.query(`
      INSERT INTO conversations (session_id, user_email, user_name, user_agent, ip_address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [sessionId, userEmail, userName, userAgent, ipAddress]);

    console.log('✅ Conversation saved to PostgreSQL:', sessionId);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Conversation created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating conversation:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation'
    });
  }
});

// Message endpoint
app.post('/api/conversations/message', async (req, res) => {
  try {
    const { sessionId, messageId, sender, content } = req.body;

    // Find conversation
    const convResult = await pool.query('SELECT id FROM conversations WHERE session_id = $1', [sessionId]);
    
    if (convResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const conversationId = convResult.rows[0].id;

    const result = await pool.query(`
      INSERT INTO messages (conversation_id, message_id, sender, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [conversationId, messageId, sender, content]);

    console.log('✅ Message saved to PostgreSQL:', `${sender}: ${content.substring(0, 50)}...`);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Message added successfully'
    });
  } catch (error) {
    console.error('❌ Error saving message:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to add message'
    });
  }
});

// Newsletter/Email interactions endpoint
app.post('/api/interactions/email', async (req, res) => {
  try {
    const { email, source } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    const result = await pool.query(`
      INSERT INTO analytics (event_type, event_data, user_email, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, ['email_interaction', JSON.stringify({ email, source }), email, ipAddress, userAgent]);

    console.log('✅ Email interaction saved to PostgreSQL:', `${email} - ${source}`);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: source === 'newsletter_subscription' 
        ? 'Newsletter subscription successful' 
        : 'Email interaction saved'
    });
  } catch (error) {
    console.error('❌ Error saving email interaction:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to process email interaction'
    });
  }
});

// Analytics tracking endpoint
app.post('/api/analytics/track', async (req, res) => {
  try {
    const { action, details, source } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    const result = await pool.query(`
      INSERT INTO analytics (event_type, event_data, ip_address, user_agent)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, ['user_interaction', JSON.stringify({ action, details, source }), ipAddress, userAgent]);

    console.log('✅ Interaction tracked in PostgreSQL:', action);

    res.status(201).json({
      success: true,
      message: 'Interaction tracked successfully'
    });
  } catch (error) {
    console.error('❌ Error tracking interaction:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to track interaction'
    });
  }
});

// Admin dashboard endpoint
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      contactStats,
      conversationStats,
      feedbackStats,
      userStats
    ] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) as total_contacts,
          COUNT(CASE WHEN DATE(created_at) = $1 THEN 1 END) as today_contacts,
          COUNT(CASE WHEN status = 'new' THEN 1 END) as new_contacts,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_contacts,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_contacts
        FROM contacts
      `, [today]),

      pool.query(`
        SELECT
          COUNT(*) as total_conversations,
          COUNT(CASE WHEN DATE(created_at) = $1 THEN 1 END) as today_conversations
        FROM conversations
      `, [today]),

      pool.query(`
        SELECT
          COUNT(*) as total_feedback,
          AVG(rating) as average_rating,
          COUNT(CASE WHEN rating >= 8 THEN 1 END) as positive_feedback,
          COUNT(CASE WHEN rating <= 5 THEN 1 END) as negative_feedback,
          COUNT(CASE WHEN feedback_text IS NOT NULL AND feedback_text != '' THEN 1 END) as with_comments
        FROM feedback
      `),

      pool.query(`
        SELECT
          COUNT(DISTINCT email) as total_users,
          COUNT(CASE WHEN DATE(created_at) = $1 THEN 1 END) as new_today
        FROM contacts
      `, [today])
    ]);

    const dashboardData = {
      contacts: contactStats.rows[0],
      conversations: conversationStats.rows[0],
      feedback: {
        ...feedbackStats.rows[0],
        average_rating: parseFloat(feedbackStats.rows[0].average_rating) || 0
      },
      users: userStats.rows[0],
      database: {
        type: 'PostgreSQL',
        status: 'Connected'
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('❌ Error getting dashboard data:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard data'
    });
  }
});

// Get all contacts
app.get('/api/admin/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT * FROM contacts
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await pool.query('SELECT COUNT(*) FROM contacts');

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        hasMore: result.rows.length === limit
      }
    });
  } catch (error) {
    console.error('❌ Error getting contacts:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get contacts'
    });
  }
});

// Get all feedback
app.get('/api/admin/feedback', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT f.*, c.session_id, c.user_email as conversation_user_email
      FROM feedback f
      LEFT JOIN conversations c ON f.conversation_id = c.id
      ORDER BY f.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await pool.query('SELECT COUNT(*) FROM feedback');

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        hasMore: result.rows.length === limit
      }
    });
  } catch (error) {
    console.error('❌ Error getting feedback:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get feedback'
    });
  }
});

// Get all conversations
app.get('/api/admin/conversations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT c.*,
        COUNT(m.id) as message_count,
        MAX(m.created_at) as last_message_at
      FROM conversations c
      LEFT JOIN messages m ON c.id = m.conversation_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await pool.query('SELECT COUNT(*) FROM conversations');

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        hasMore: result.rows.length === limit
      }
    });
  } catch (error) {
    console.error('❌ Error getting conversations:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversations'
    });
  }
});

// Root endpoint
app.get('/', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM contacts) as contacts,
        (SELECT COUNT(*) FROM conversations) as conversations,
        (SELECT COUNT(*) FROM feedback) as feedback,
        (SELECT COUNT(*) FROM analytics) as analytics
    `);

    res.json({
      message: 'Genrec AI Backend - PostgreSQL',
      status: 'Running',
      database: {
        type: 'PostgreSQL',
        status: 'Connected'
      },
      data_count: stats.rows[0],
      endpoints: {
        health: '/health',
        contacts: '/api/contacts',
        feedback: '/api/feedback',
        conversations: '/api/conversations',
        admin: '/api/admin/dashboard'
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Genrec AI Backend - PostgreSQL',
      status: 'Running',
      database: {
        type: 'PostgreSQL',
        status: 'Error'
      },
      error: error.message
    });
  }
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Genrec AI Backend (PostgreSQL) running on http://localhost:${PORT}`);
    console.log(`🐘 Database: PostgreSQL`);
    console.log(`📊 All data persists permanently`);
    console.log(`🔍 Admin dashboard: http://localhost:${PORT}/api/admin/dashboard`);
  });
}

module.exports = app;
