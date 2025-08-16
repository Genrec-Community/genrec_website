const db = require('../../server/services/database');

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
      const trackingData = await db.createInteraction({
        ...req.body,
        interactionType: req.body.interactionType || 'page_view'
      });
      logger.info('Interaction tracked:', trackingData);

      res.status(201).json({
        success: true,
        message: 'Interaction tracked successfully'
      });
    } catch (error) {
      logger.error('Tracking error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track interaction'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
