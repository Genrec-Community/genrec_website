// Debug environment variables
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
    const envInfo = {
      // Database variables
      DB_HOST: process.env.DB_HOST || 'NOT SET',
      DB_PORT: process.env.DB_PORT || 'NOT SET',
      DB_NAME: process.env.DB_NAME || 'NOT SET', 
      DB_USER: process.env.DB_USER || 'NOT SET',
      DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : 'NOT SET',
      
      // Other variables
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? '***SET***' : 'NOT SET',
      TRUST_PROXY: process.env.TRUST_PROXY || 'NOT SET',
      
      // All environment variable keys that contain DB or DATABASE
      all_db_keys: Object.keys(process.env).filter(key => 
        key.toLowerCase().includes('db') || 
        key.toLowerCase().includes('database') ||
        key.toLowerCase().includes('postgres') ||
        key.toLowerCase().includes('supabase')
      ),
      
      // Total environment variables count
      total_env_vars: Object.keys(process.env).length,
      
      // Vercel specific
      vercel_env: process.env.VERCEL_ENV,
      vercel_url: process.env.VERCEL_URL,
      vercel_region: process.env.VERCEL_REGION
    };

    return res.status(200).json({
      status: 'DEBUG_SUCCESS',
      timestamp: new Date().toISOString(),
      environment_info: envInfo
    });

  } catch (error) {
    return res.status(500).json({
      status: 'DEBUG_ERROR',
      error: error.message,
      stack: error.stack
    });
  }
};
