// Vercel Serverless API for Genrec AI Backend
const { Pool } = require('pg');

// Database connection using individual parameters
const pool = new Pool({
  host: process.env.DB_HOST || 'db.rsfoeccesdgjpvpqkyzc.supabase.co',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });
  res.status(statusCode).json(data);
}

// Main handler function
module.exports = async (req, res) => {
  const { method, url } = req;
  
  // Handle preflight requests
  if (method === 'OPTIONS') {
    Object.keys(corsHeaders).forEach(key => {
      res.setHeader(key, corsHeaders[key]);
    });
    return res.status(200).end();
  }

  console.log(`${method} ${url} - ${new Date().toISOString()}`);

  try {
    // Normalize URL (remove trailing slash)
    const normalizedUrl = url.endsWith('/') && url !== '/' ? url.slice(0, -1) : url;

    // Debug environment variables
    if (normalizedUrl === '/api/debug-env') {
      const envInfo = {
        DB_HOST: process.env.DB_HOST || 'NOT SET',
        DB_PORT: process.env.DB_PORT || 'NOT SET',
        DB_NAME: process.env.DB_NAME || 'NOT SET',
        DB_USER: process.env.DB_USER || 'NOT SET',
        DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT SET',
        all_db_keys: Object.keys(process.env).filter(key =>
          key.toLowerCase().includes('db') ||
          key.toLowerCase().includes('database')
        )
      };

      return sendJSON(res, 200, {
        status: 'DEBUG_INFO',
        timestamp: new Date().toISOString(),
        environment_info: envInfo
      });
    }

    // Health check
    if (normalizedUrl === '/api/health' || normalizedUrl === '/' || normalizedUrl === '/api') {
      try {
        const result = await pool.query('SELECT NOW() as current_time');
        return sendJSON(res, 200, {
          status: 'OK',
          timestamp: new Date().toISOString(),
          database: 'Connected',
          environment: 'Vercel + Supabase',
          db_time: result.rows[0].current_time
        });
      } catch (dbError) {
        return sendJSON(res, 500, {
          status: 'ERROR',
          error: 'Database connection failed',
          message: dbError.message
        });
      }
    }

    // Contact form
    if (normalizedUrl === '/api/contacts' && method === 'POST') {
      const { name, email, phone, company, projectType, budget, timeline, message } = req.body;
      
      console.log('📧 Contact form submission:', { name, email });
      
      const result = await pool.query(`
        INSERT INTO contacts (name, email, phone, company, project_type, budget, timeline, message)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [name, email, phone, company, projectType, budget, timeline, message]);

      console.log('✅ Contact saved:', result.rows[0].id);

      return sendJSON(res, 201, {
        success: true,
        data: result.rows[0],
        message: 'Contact submitted successfully'
      });
    }

    // Feedback
    if (normalizedUrl === '/api/feedback' && method === 'POST') {
      const { sessionId, rating, feedbackText, messageId, userEmail } = req.body;
      
      console.log('⭐ Feedback submission:', { sessionId, rating });
      
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

      console.log('✅ Feedback saved:', result.rows[0].id);

      return sendJSON(res, 201, {
        success: true,
        data: result.rows[0],
        message: 'Feedback submitted successfully'
      });
    }

    // Newsletter
    if (normalizedUrl === '/api/interactions/email' && method === 'POST') {
      const { email, source } = req.body;
      
      console.log('📧 Email interaction:', { email, source });

      const result = await pool.query(`
        INSERT INTO analytics (event_type, event_data, user_email)
        VALUES ($1, $2, $3)
        RETURNING *
      `, ['email_interaction', JSON.stringify({ email, source }), email]);

      console.log('✅ Email interaction saved:', result.rows[0].id);

      return sendJSON(res, 201, {
        success: true,
        data: result.rows[0],
        message: source === 'newsletter_subscription' 
          ? 'Newsletter subscription successful' 
          : 'Email interaction saved'
      });
    }

    // Admin endpoints
    if (normalizedUrl === '/api/admin/feedback' && method === 'GET') {
      const result = await pool.query(`
        SELECT f.*, c.session_id, c.user_email as conversation_user_email
        FROM feedback f
        LEFT JOIN conversations c ON f.conversation_id = c.id
        ORDER BY f.created_at DESC 
        LIMIT 100
      `);

      console.log(`✅ Retrieved ${result.rows.length} feedback entries`);

      return sendJSON(res, 200, {
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    }

    if (normalizedUrl === '/api/admin/contacts' && method === 'GET') {
      const result = await pool.query(`
        SELECT * FROM contacts 
        ORDER BY created_at DESC 
        LIMIT 100
      `);

      return sendJSON(res, 200, {
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    }

    if (normalizedUrl === '/api/admin/dashboard' && method === 'GET') {
      const [contactStats, conversationStats, feedbackStats] = await Promise.all([
        pool.query(`SELECT COUNT(*) as total_contacts FROM contacts`),
        pool.query(`SELECT COUNT(*) as total_conversations FROM conversations`),
        pool.query(`SELECT COUNT(*) as total_feedback, AVG(rating) as average_rating FROM feedback`)
      ]);

      return sendJSON(res, 200, {
        success: true,
        data: {
          contacts: { total_contacts: parseInt(contactStats.rows[0].total_contacts) },
          conversations: { total_conversations: parseInt(conversationStats.rows[0].total_conversations) },
          feedback: { 
            total_feedback: parseInt(feedbackStats.rows[0].total_feedback),
            average_rating: parseFloat(feedbackStats.rows[0].average_rating) || 0
          },
          database: { type: 'Supabase PostgreSQL', status: 'Connected' }
        }
      });
    }

    // 404 for other routes
    return sendJSON(res, 404, {
      error: 'Route not found',
      method,
      original_url: url,
      normalized_url: normalizedUrl,
      available_routes: [
        'GET /',
        'GET /api',
        'GET /api/health',
        'POST /api/contacts',
        'POST /api/feedback',
        'POST /api/interactions/email',
        'GET /api/admin/dashboard',
        'GET /api/admin/contacts',
        'GET /api/admin/feedback'
      ]
    });

  } catch (error) {
    console.error('❌ API Error:', error);
    return sendJSON(res, 500, {
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};
