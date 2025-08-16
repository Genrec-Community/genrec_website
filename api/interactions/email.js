const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://liudfsttbkzfchsgovaj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpdWRmc3R0Ymt6ZmNoc2dvdmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNzQwMzMsImV4cCI6MjA3MDY1MDAzM30.x916YmKm-5QZ4kuCLSqmbHxI3_sQ5yTRWzWNvfk_4DY';

const supabase = createClient(supabaseUrl, supabaseKey);

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
      // Create interaction record
      const { data, error } = await supabase
        .from('interactions')
        .insert([{
          user_id: req.body.userId || null,
          session_id: req.body.sessionId || `session_${Date.now()}`,
          interaction_type: 'email_signup',
          source: req.body.source || 'newsletter_subscription',
          data: { email: req.body.email },
          metadata: req.body.metadata || {}
        }])
        .select()
        .single();

      if (error) {
        logger.error('Supabase error:', error);
        throw error;
      }

      logger.info('Email interaction:', data);

      res.status(201).json({
        success: true,
        data: data,
        message: req.body.source === 'newsletter_subscription'
          ? 'Newsletter subscription successful'
          : 'Email interaction saved successfully'
      });
    } catch (error) {
      logger.error('Email interaction error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process email interaction'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
