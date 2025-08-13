// Simple database connection test
const { Pool } = require('pg');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Environment variables check:');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);
    console.log('DATABASE_URL preview:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'NOT SET');

    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: 'DATABASE_URL environment variable is not set',
        available_env_vars: Object.keys(process.env).filter(key => key.includes('DB') || key.includes('DATABASE'))
      });
    }

    // Test database connection using individual parameters
    const pool = new Pool({
      host: process.env.DB_HOST || 'db.rsfoeccesdgjpvpqkyzc.supabase.co',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'postgres',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    });

    console.log('Attempting database connection...');
    
    const client = await pool.connect();
    console.log('Database connected successfully');
    
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('Query executed successfully');
    
    client.release();
    await pool.end();

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Database connection successful',
      database_time: result.rows[0].current_time,
      postgres_version: result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1],
      connection_info: {
        database_url_set: true,
        database_url_length: process.env.DATABASE_URL.length,
        ssl_enabled: true
      }
    });

  } catch (error) {
    console.error('Database connection error:', error);
    
    return res.status(500).json({
      status: 'ERROR',
      error: 'Database connection failed',
      message: error.message,
      code: error.code,
      details: {
        database_url_set: !!process.env.DATABASE_URL,
        database_url_preview: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET',
        error_type: error.constructor.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
};
