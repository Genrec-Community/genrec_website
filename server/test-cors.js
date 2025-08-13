// CORS Test Script - Verify that CORS is properly configured
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

console.log('🔧 Testing CORS Configuration...\n');

// CORS Configuration - The CRITICAL fix
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Additional CORS headers middleware for maximum compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Log all requests for debugging
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight request handled successfully');
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(express.json());

// Test endpoints
app.get('/health', (req, res) => {
  console.log('✅ Health check accessed');
  res.json({ 
    status: 'OK', 
    cors: 'Configured',
    timestamp: new Date().toISOString(),
    headers: {
      'Access-Control-Allow-Origin': res.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': res.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': res.get('Access-Control-Allow-Headers')
    }
  });
});

app.post('/api/contacts', (req, res) => {
  console.log('✅ Contact form submission received:', req.body.email || 'no email');
  res.json({ 
    success: true, 
    message: 'Contact submitted successfully',
    data: { id: Date.now(), ...req.body }
  });
});

app.post('/api/feedback', (req, res) => {
  console.log('✅ Feedback received:', `Rating: ${req.body.rating}`);
  res.json({ 
    success: true, 
    message: 'Feedback submitted successfully',
    data: { id: Date.now(), ...req.body }
  });
});

app.post('/api/interactions/email', (req, res) => {
  console.log('✅ Newsletter subscription:', req.body.email);
  res.json({ 
    success: true, 
    message: 'Newsletter subscription successful',
    data: { id: Date.now(), ...req.body }
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'CORS Test Server - All endpoints configured',
    status: 'Running',
    cors_config: {
      origins: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true
    },
    test_endpoints: {
      health: '/health',
      contact: 'POST /api/contacts',
      feedback: 'POST /api/feedback',
      newsletter: 'POST /api/interactions/email'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CORS Test Server running on http://localhost:${PORT}`);
  console.log(`📡 Configured to accept requests from:`);
  console.log(`   - http://localhost:3000`);
  console.log(`   - http://127.0.0.1:3000`);
  console.log(`\n🔍 Test the CORS configuration:`);
  console.log(`   1. Start your frontend (npm start)`);
  console.log(`   2. Try submitting forms`);
  console.log(`   3. Watch this terminal for request logs`);
  console.log(`\n✅ If you see request logs here, CORS is working!`);
  console.log(`❌ If forms still fail, check browser console for errors\n`);
});

// Handle server errors
process.on('uncaughtException', (err) => {
  console.error('❌ Server error:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled rejection:', err.message);
});
