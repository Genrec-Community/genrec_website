// Persistent Server - Saves data to JSON files
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5000;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Data file paths
const FILES = {
  contacts: path.join(DATA_DIR, 'contacts.json'),
  feedback: path.join(DATA_DIR, 'feedback.json'),
  interactions: path.join(DATA_DIR, 'interactions.json'),
  conversations: path.join(DATA_DIR, 'conversations.json')
};

// Load data from files
function loadData(filename) {
  try {
    if (fs.existsSync(filename)) {
      const data = fs.readFileSync(filename, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading ${filename}:`, error.message);
  }
  return [];
}

// Save data to files
function saveData(filename, data) {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving ${filename}:`, error.message);
    return false;
  }
}

// Load all data on startup
let contacts = loadData(FILES.contacts);
let feedback = loadData(FILES.feedback);
let interactions = loadData(FILES.interactions);
let conversations = loadData(FILES.conversations);

console.log(`📁 Data loaded from files:`);
console.log(`   Contacts: ${contacts.length}`);
console.log(`   Feedback: ${feedback.length}`);
console.log(`   Interactions: ${interactions.length}`);
console.log(`   Conversations: ${conversations.length}`);

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
        storage: 'Persistent JSON files',
        data_location: DATA_DIR
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
      saveData(FILES.contacts, contacts);
      log('Contact saved to file:', contact.email || 'no email');
      sendJSON(res, 201, {
        success: true,
        data: contact,
        message: 'Contact submitted and saved to file'
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
      saveData(FILES.feedback, feedback);
      log('Feedback saved to file:', `Rating: ${fb.rating}`);
      sendJSON(res, 201, {
        success: true,
        data: fb,
        message: 'Feedback submitted and saved to file'
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
      saveData(FILES.interactions, interactions);
      log('Email interaction saved to file:', `${body.email} - ${body.source}`);
      sendJSON(res, 201, {
        success: true,
        data: interaction,
        message: body.source === 'newsletter_subscription' 
          ? 'Newsletter subscription saved to file' 
          : 'Email interaction saved to file'
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
      conversations.push(conversation);
      saveData(FILES.conversations, conversations);
      log('Conversation saved to file:', body.sessionId);
      sendJSON(res, 201, {
        success: true,
        data: conversation,
        message: 'Conversation created and saved to file'
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
      
      // Find conversation and add message
      const conv = conversations.find(c => c.sessionId === body.sessionId);
      if (conv) {
        if (!conv.messages) conv.messages = [];
        conv.messages.push(message);
        saveData(FILES.conversations, conversations);
      }
      
      log('Message saved to file:', `${body.sender}: ${body.content?.substring(0, 50)}...`);
      sendJSON(res, 201, {
        success: true,
        data: message,
        message: 'Message added and saved to file'
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
      saveData(FILES.interactions, interactions);
      log('Interaction tracked and saved:', body.action);
      sendJSON(res, 201, {
        success: true,
        message: 'Interaction tracked and saved to file'
      });
      return;
    }

    // Admin endpoints
    if (path === '/api/admin/contacts' && method === 'GET') {
      sendJSON(res, 200, { success: true, data: contacts, count: contacts.length });
      return;
    }

    if (path === '/api/admin/feedback' && method === 'GET') {
      sendJSON(res, 200, { success: true, data: feedback, count: feedback.length });
      return;
    }

    if (path === '/api/admin/interactions' && method === 'GET') {
      sendJSON(res, 200, { success: true, data: interactions, count: interactions.length });
      return;
    }

    if (path === '/api/admin/conversations' && method === 'GET') {
      sendJSON(res, 200, { success: true, data: conversations, count: conversations.length });
      return;
    }

    if (path === '/api/admin/dashboard' && method === 'GET') {
      const today = new Date().toDateString();
      sendJSON(res, 200, {
        success: true,
        data: {
          storage: {
            type: 'JSON Files',
            location: DATA_DIR,
            files: Object.keys(FILES)
          },
          conversations: { 
            total_conversations: conversations.length, 
            today_conversations: conversations.filter(c => new Date(c.created_at).toDateString() === today).length 
          },
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
          users: { 
            total_users: new Set(contacts.map(c => c.email)).size, 
            new_today: contacts.filter(c => new Date(c.created_at).toDateString() === today).length 
          }
        }
      });
      return;
    }

    // Root endpoint
    if (path === '/' && method === 'GET') {
      sendJSON(res, 200, {
        message: 'Genrec AI Backend - Persistent Storage',
        status: 'Running',
        storage: {
          type: 'JSON Files',
          location: DATA_DIR,
          files: {
            contacts: `${contacts.length} entries`,
            feedback: `${feedback.length} entries`,
            interactions: `${interactions.length} entries`,
            conversations: `${conversations.length} entries`
          }
        },
        data_access: {
          contacts: '/api/admin/contacts',
          feedback: '/api/admin/feedback',
          interactions: '/api/admin/interactions',
          conversations: '/api/admin/conversations',
          dashboard: '/api/admin/dashboard'
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
  console.log(`🚀 Genrec AI Backend (Persistent Storage) running on http://localhost:${PORT}`);
  console.log(`📁 Data stored in: ${DATA_DIR}`);
  console.log(`📊 Data files:`);
  console.log(`   - contacts.json (${contacts.length} entries)`);
  console.log(`   - feedback.json (${feedback.length} entries)`);
  console.log(`   - interactions.json (${interactions.length} entries)`);
  console.log(`   - conversations.json (${conversations.length} entries)`);
  console.log(`\n✅ All data persists between server restarts!`);
  console.log(`🔍 View data: http://localhost:${PORT}/api/admin/dashboard`);
});

// Graceful shutdown - save data before exit
process.on('SIGINT', () => {
  console.log('\n💾 Saving all data before shutdown...');
  saveData(FILES.contacts, contacts);
  saveData(FILES.feedback, feedback);
  saveData(FILES.interactions, interactions);
  saveData(FILES.conversations, conversations);
  console.log('✅ All data saved successfully!');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err.message);
  // Save data before crash
  saveData(FILES.contacts, contacts);
  saveData(FILES.feedback, feedback);
  saveData(FILES.interactions, interactions);
  saveData(FILES.conversations, conversations);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err.message);
});
