// Production-Ready Server for Genrec AI
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Production security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Trust proxy for Railway/Heroku
if (process.env.TRUST_PROXY) {
  app.set('trust proxy', 1);
}

// Compression for better performance
app.use(compression());

// CORS configuration for production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [process.env.FRONTEND_URL || 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
}));

// Rate limiting for production
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// PostgreSQL connection (Railway/Production)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connected to production database');
    release();
  }
});

// Initialize database tables
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create tables (same as before but with production optimizations)
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
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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

    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        message_id VARCHAR(255),
        rating INTEGER CHECK (rating >= 1 AND rating <= 10),
        feedback_text TEXT,
        user_email VARCHAR(255),
        ip_address INET,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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

    // Create indexes for production performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)',
      'CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status)',
      'CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id)',
      'CREATE INDEX IF NOT EXISTS idx_conversations_user_email ON conversations(user_email)',
      'CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)',
      'CREATE INDEX IF NOT EXISTS idx_feedback_conversation_id ON feedback(conversation_id)',
      'CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating)',
      'CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type)',
      'CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)'
    ];

    for (const indexQuery of indexes) {
      await client.query(indexQuery);
    }

    console.log('✅ Production database initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Initialize database on startup
initializeDatabase().catch(console.error);

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${ip}`);
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'Connected',
      version: '1.0.0'
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
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');
    
    const result = await pool.query(`
      INSERT INTO contacts (name, email, phone, company, project_type, budget, timeline, message, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [name, email, phone, company, projectType, budget, timeline, message, ipAddress, userAgent]);

    console.log('✅ Contact saved:', email);

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
    const ipAddress = req.ip;
    
    // Find conversation
    const convResult = await pool.query('SELECT id FROM conversations WHERE session_id = $1', [sessionId]);
    let conversationId = null;
    
    if (convResult.rows.length > 0) {
      conversationId = convResult.rows[0].id;
    }

    const result = await pool.query(`
      INSERT INTO feedback (conversation_id, message_id, rating, feedback_text, user_email, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [conversationId, messageId, rating, feedbackText, userEmail, ipAddress]);

    console.log('✅ Feedback saved:', `Rating: ${rating}`);

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

    console.log('✅ Email interaction saved:', `${email} - ${source}`);

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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Genrec AI Production Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔒 Security: Enabled`);
  console.log(`📊 Database: PostgreSQL`);
});

module.exports = app;
