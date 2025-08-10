// Vercel Serverless API for Genrec AI Backend
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to Supabase database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['https://genrec-website.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      environment: 'Vercel + Supabase',
      db_time: result.rows[0].current_time,
      postgres_version: result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      error: 'Database connection failed',
      message: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Genrec AI Backend API',
    status: 'Running',
    environment: 'Vercel + Supabase',
    endpoints: {
      health: '/api/health',
      contacts: '/api/contacts',
      feedback: '/api/feedback',
      conversations: '/api/conversations',
      newsletter: '/api/interactions/email',
      dashboard: '/api/admin/dashboard'
    }
  });
});

// Contact form endpoint
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, phone, company, projectType, budget, timeline, message } = req.body;
    
    console.log('📧 Contact form submission:', { name, email, company });
    
    const result = await pool.query(`
      INSERT INTO contacts (name, email, phone, company, project_type, budget, timeline, message)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [name, email, phone, company, projectType, budget, timeline, message]);

    console.log('✅ Contact saved to Supabase:', result.rows[0].id);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Contact submitted successfully'
    });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form',
      details: error.message
    });
  }
});

// Feedback endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { sessionId, rating, feedbackText, messageId, userEmail } = req.body;
    
    console.log('⭐ Feedback submission:', { sessionId, rating, userEmail });
    
    // Find conversation
    let conversationId = null;
    if (sessionId) {
      const convResult = await pool.query('SELECT id FROM conversations WHERE session_id = $1', [sessionId]);
      if (convResult.rows.length > 0) {
        conversationId = convResult.rows[0].id;
      }
    }

    const result = await pool.query(`
      INSERT INTO feedback (conversation_id, message_id, rating, feedback_text, user_email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [conversationId, messageId, rating, feedbackText, userEmail]);

    console.log('✅ Feedback saved to Supabase:', result.rows[0].id);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('❌ Error saving feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback',
      details: error.message
    });
  }
});

// Conversation endpoint
app.post('/api/conversations', async (req, res) => {
  try {
    const { sessionId, userEmail, userName } = req.body;
    
    console.log('💬 Conversation creation:', { sessionId, userEmail, userName });

    // Check if conversation exists
    const existing = await pool.query('SELECT * FROM conversations WHERE session_id = $1', [sessionId]);
    
    if (existing.rows.length > 0) {
      console.log('✅ Conversation already exists:', existing.rows[0].id);
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

    console.log('✅ Conversation saved to Supabase:', result.rows[0].id);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Conversation created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation',
      details: error.message
    });
  }
});

// Message endpoint
app.post('/api/conversations/message', async (req, res) => {
  try {
    const { sessionId, messageId, sender, content } = req.body;
    
    console.log('💬 Message submission:', { sessionId, sender, content: content?.substring(0, 50) + '...' });

    // Find conversation
    const convResult = await pool.query('SELECT id FROM conversations WHERE session_id = $1', [sessionId]);
    
    if (convResult.rows.length === 0) {
      console.log('❌ Conversation not found for session:', sessionId);
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

    console.log('✅ Message saved to Supabase:', result.rows[0].id);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Message added successfully'
    });
  } catch (error) {
    console.error('❌ Error saving message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add message',
      details: error.message
    });
  }
});

// Newsletter/Email interactions endpoint
app.post('/api/interactions/email', async (req, res) => {
  try {
    const { email, source } = req.body;
    
    console.log('📧 Email interaction:', { email, source });

    const result = await pool.query(`
      INSERT INTO analytics (event_type, event_data, user_email)
      VALUES ($1, $2, $3)
      RETURNING *
    `, ['email_interaction', JSON.stringify({ email, source }), email]);

    console.log('✅ Email interaction saved to Supabase:', result.rows[0].id);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: source === 'newsletter_subscription' 
        ? 'Newsletter subscription successful' 
        : 'Email interaction saved'
    });
  } catch (error) {
    console.error('❌ Error saving email interaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process email interaction',
      details: error.message
    });
  }
});

// Analytics tracking endpoint
app.post('/api/analytics/track', async (req, res) => {
  try {
    const { action, details, source } = req.body;
    
    console.log('📊 Analytics tracking:', { action, source });

    const result = await pool.query(`
      INSERT INTO analytics (event_type, event_data)
      VALUES ($1, $2)
      RETURNING *
    `, ['user_interaction', JSON.stringify({ action, details, source })]);

    console.log('✅ Interaction tracked in Supabase:', result.rows[0].id);

    res.status(201).json({
      success: true,
      message: 'Interaction tracked successfully'
    });
  } catch (error) {
    console.error('❌ Error tracking interaction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track interaction',
      details: error.message
    });
  }
});

// Admin dashboard endpoint
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    console.log('📊 Dashboard request');
    
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
      contacts: {
        total_contacts: parseInt(contactStats.rows[0].total_contacts),
        today_contacts: parseInt(contactStats.rows[0].today_contacts),
        new_contacts: parseInt(contactStats.rows[0].total_contacts),
        in_progress_contacts: 0,
        completed_contacts: 0
      },
      conversations: {
        total_conversations: parseInt(conversationStats.rows[0].total_conversations),
        today_conversations: parseInt(conversationStats.rows[0].today_conversations)
      },
      feedback: {
        total_feedback: parseInt(feedbackStats.rows[0].total_feedback),
        average_rating: parseFloat(feedbackStats.rows[0].average_rating) || 0,
        positive_feedback: parseInt(feedbackStats.rows[0].positive_feedback),
        negative_feedback: parseInt(feedbackStats.rows[0].negative_feedback),
        with_comments: 0
      },
      users: {
        total_users: parseInt(contactStats.rows[0].total_contacts),
        new_today: parseInt(contactStats.rows[0].today_contacts)
      },
      database: {
        type: 'Supabase PostgreSQL',
        status: 'Connected'
      }
    };

    console.log('✅ Dashboard data retrieved');

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('❌ Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard data',
      details: error.message
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

    console.log(`✅ Retrieved ${result.rows.length} contacts`);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error getting contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get contacts',
      details: error.message
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

    console.log(`✅ Retrieved ${result.rows.length} feedback entries`);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error getting feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get feedback',
      details: error.message
    });
  }
});

// Handle all other routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    available_routes: [
      'GET /',
      'GET /api/health',
      'POST /api/contacts',
      'POST /api/feedback',
      'POST /api/conversations',
      'POST /api/conversations/message',
      'POST /api/interactions/email',
      'POST /api/analytics/track',
      'GET /api/admin/dashboard',
      'GET /api/admin/contacts',
      'GET /api/admin/feedback'
    ]
  });
});

// Export for Vercel
module.exports = app;
