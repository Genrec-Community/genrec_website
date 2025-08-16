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
      // Create contact record
      const { data, error } = await supabase
        .from('contacts')
        .insert([{
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          company: req.body.company,
          message: req.body.message,
          source: req.body.source || 'website',
          status: 'new',
          metadata: req.body.metadata || {}
        }])
        .select()
        .single();

      if (error) {
        logger.error('Supabase error:', error);
        throw error;
      }

      logger.info('Contact received:', data);

      res.status(201).json({
        success: true,
        data: data,
        message: 'Contact submission received successfully'
      });
    } catch (error) {
      logger.error('Contact error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit contact form'
      });
    }
  } else if (req.method === 'GET') {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const filters = req.query;

      let query = supabase
        .from('contacts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.source) {
        query = query.eq('source', filters.source);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      const result = {
        data,
        count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };

      res.json({ success: true, ...result });
    } catch (error) {
      logger.error('Get contacts error:', error);
      res.status(500).json({ success: false, error: 'Failed to get contacts' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
