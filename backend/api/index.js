// Vercel Serverless Function for Genrec AI Backend
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');

const app = express();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      environment: 'Vercel + Supabase'
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

// Conversation endpoint
app.post('/api/conversations', async (req, res) => {
  try {
    const { sessionId, userEmail, userName } = req.body;

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
      INSERT INTO conversations (session_id, user_email, user_name)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [sessionId, userEmail, userName]);

    console.log('✅ Conversation saved:', sessionId);

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

    console.log('✅ Message saved:', `${sender}: ${content.substring(0, 50)}...`);

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

    const result = await pool.query(`
      INSERT INTO analytics (event_type, event_data, user_email)
      VALUES ($1, $2, $3)
      RETURNING *
    `, ['email_interaction', JSON.stringify({ email, source }), email]);

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

// Analytics tracking endpoint
app.post('/api/analytics/track', async (req, res) => {
  try {
    const { action, details, source } = req.body;

    const result = await pool.query(`
      INSERT INTO analytics (event_type, event_data)
      VALUES ($1, $2)
      RETURNING *
    `, ['user_interaction', JSON.stringify({ action, details, source })]);

    console.log('✅ Interaction tracked:', action);

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

    const [contactStats, conversationStats, feedbackStats] = await Promise.all([
      pool.query(`
        SELECT 
          COUNT(*) as total_contacts,
          COUNT(CASE WHEN DATE(created_at) = $1 THEN 1 END) as today_contacts
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
          COUNT(CASE WHEN rating <= 5 THEN 1 END) as negative_feedback
        FROM feedback
      `)
    ]);

    const dashboardData = {
      contacts: contactStats.rows[0],
      conversations: conversationStats.rows[0],
      feedback: {
        ...feedbackStats.rows[0],
        average_rating: parseFloat(feedbackStats.rows[0].average_rating) || 0
      },
      database: {
        type: 'Supabase PostgreSQL',
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
    const result = await pool.query(`
      SELECT * FROM contacts 
      ORDER BY created_at DESC 
      LIMIT 100
    `);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
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
    const result = await pool.query(`
      SELECT f.*, c.session_id, c.user_email as conversation_user_email
      FROM feedback f
      LEFT JOIN conversations c ON f.conversation_id = c.id
      ORDER BY f.created_at DESC 
      LIMIT 100
    `);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error getting feedback:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get feedback'
    });
  }
});

// Export for Vercel
module.exports = app;
