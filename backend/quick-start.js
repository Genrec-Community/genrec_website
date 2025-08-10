// Quick Start Script - No dependencies required
// This creates a minimal server using only Node.js built-in modules

const http = require('http');
const url = require('url');

const PORT = 5000;

// Simple in-memory storage
let contacts = [];
let feedback = [];
let interactions = [];

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
  'Access-Control-Allow-Credentials': 'true',
  'Content-Type': 'application/json'
};

// Helper function to parse JSON body
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

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, corsHeaders);
  res.end(JSON.stringify(data));
}

// Log function
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
        message: 'CORS-enabled server running'
      });
      return;
    }

    // Contact form
    if (path === '/api/contacts' && method === 'POST') {
      const body = await parseBody(req);
      const contact = {
        id: Date.now(),
        ...body,
        created_at: new Date().toISOString()
      };
      contacts.push(contact);
      log('Contact received:', contact.email || 'no email');
      sendJSON(res, 201, {
        success: true,
        data: contact,
        message: 'Contact submitted successfully'
      });
      return;
    }

    // Feedback
    if (path === '/api/feedback' && method === 'POST') {
      const body = await parseBody(req);
      const fb = {
        id: Date.now(),
        ...body,
        created_at: new Date().toISOString()
      };
      feedback.push(fb);
      log('Feedback received:', `Rating: ${fb.rating}`);
      sendJSON(res, 201, {
        success: true,
        data: fb,
        message: 'Feedback submitted successfully'
      });
      return;
    }

    // Newsletter/Email interactions
    if (path === '/api/interactions/email' && method === 'POST') {
      const body = await parseBody(req);
      const interaction = {
        id: Date.now(),
        ...body,
        created_at: new Date().toISOString()
      };
      interactions.push(interaction);
      log('Email interaction:', `${body.email} - ${body.source}`);
      sendJSON(res, 201, {
        success: true,
        data: interaction,
        message: body.source === 'newsletter_subscription' 
          ? 'Newsletter subscription successful' 
          : 'Email interaction saved'
      });
      return;
    }

    // Conversations
    if (path === '/api/conversations' && method === 'POST') {
      const body = await parseBody(req);
      const conversation = {
        id: Date.now(),
        ...body,
        messages: [],
        created_at: new Date().toISOString()
      };
      log('Conversation created:', body.sessionId);
      sendJSON(res, 201, {
        success: true,
        data: conversation,
        message: 'Conversation created successfully'
      });
      return;
    }

    // Messages
    if (path === '/api/conversations/message' && method === 'POST') {
      const body = await parseBody(req);
      const message = {
        id: Date.now(),
        ...body,
        created_at: new Date().toISOString()
      };
      log('Message added:', `${body.sender}: ${body.content?.substring(0, 50)}...`);
      sendJSON(res, 201, {
        success: true,
        data: message,
        message: 'Message added successfully'
      });
      return;
    }

    // Analytics tracking
    if (path === '/api/analytics/track' && method === 'POST') {
      const body = await parseBody(req);
      const track = {
        id: Date.now(),
        ...body,
        created_at: new Date().toISOString()
      };
      interactions.push(track);
      log('Interaction tracked:', body.action);
      sendJSON(res, 201, {
        success: true,
        message: 'Interaction tracked successfully'
      });
      return;
    }

    // Admin endpoints
    if (path === '/api/admin/contacts' && method === 'GET') {
      sendJSON(res, 200, { success: true, data: contacts });
      return;
    }

    if (path === '/api/admin/feedback' && method === 'GET') {
      sendJSON(res, 200, { success: true, data: feedback });
      return;
    }

    if (path === '/api/admin/dashboard' && method === 'GET') {
      const today = new Date().toDateString();
      sendJSON(res, 200, {
        success: true,
        data: {
          conversations: { total_conversations: 0, today_conversations: 0 },
          contacts: {
            total_contacts: contacts.length,
            today_contacts: contacts.filter(c => new Date(c.created_at).toDateString() === today).length,
            new_contacts: contacts.length,
            in_progress_contacts: 0,
            completed_contacts: 0
          },
          feedback: {
            total_feedback: feedback.length,
            average_rating: feedback.length > 0 ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length : 0,
            positive_feedback: feedback.filter(f => f.rating >= 8).length,
            negative_feedback: feedback.filter(f => f.rating <= 5).length,
            with_comments: feedback.filter(f => f.feedbackText).length
          },
          users: { total_users: new Set(contacts.map(c => c.email)).size, new_today: 0 }
        }
      });
      return;
    }

    // Root endpoint
    if (path === '/' && method === 'GET') {
      sendJSON(res, 200, {
        message: 'Genrec AI Backend - No Dependencies Version',
        status: 'Running',
        cors: 'Enabled',
        data_count: {
          contacts: contacts.length,
          feedback: feedback.length,
          interactions: interactions.length
        }
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
  console.log(`🚀 Genrec AI Backend (No Dependencies) running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for http://localhost:3000`);
  console.log(`✅ All endpoints ready - no npm install required!`);
  console.log(`\n📊 Available endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   POST /api/contacts`);
  console.log(`   POST /api/feedback`);
  console.log(`   POST /api/interactions/email`);
  console.log(`   POST /api/conversations`);
  console.log(`   POST /api/conversations/message`);
  console.log(`   GET  /api/admin/dashboard`);
  console.log(`\n🔍 Test with: curl http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err.message);
});
