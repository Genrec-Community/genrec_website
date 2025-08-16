const db = require('../server/services/database');

// Simple logger
const logger = {
  info: (msg, data) => console.log(`[INFO] ${msg}`, data || ''),
  error: (msg, data) => console.error(`[ERROR] ${msg}`, data || ''),
  warn: (msg, data) => console.warn(`[WARN] ${msg}`, data || '')
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const conversationData = await db.createConversation(req.body);
      logger.info('Conversation created:', conversationData);

      res.status(201).json({
        success: true,
        data: conversationData,
        message: 'Conversation created successfully'
      });
    } catch (error) {
      logger.error('Conversation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create conversation'
      });
    }
  } else if (req.method === 'GET') {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const filters = req.query;

      const result = await db.getConversations(page, limit, filters);
      res.json({ success: true, ...result });
    } catch (error) {
      logger.error('Get conversations error:', error);
      res.status(500).json({ success: false, error: 'Failed to get conversations' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
