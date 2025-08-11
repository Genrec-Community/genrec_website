// Debug endpoint to check environment variables
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
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      DATABASE_URL_PREVIEW: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'NOT SET',
      FRONTEND_URL: process.env.FRONTEND_URL,
      ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
      JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
      TRUST_PROXY: process.env.TRUST_PROXY,
      ALL_ENV_KEYS: Object.keys(process.env).filter(key => 
        key.includes('DATABASE') || 
        key.includes('DB_') || 
        key.includes('FRONTEND') || 
        key.includes('SUPABASE')
      )
    };

    return res.status(200).json({
      status: 'DEBUG_INFO',
      timestamp: new Date().toISOString(),
      environment_variables: envVars,
      vercel_info: {
        region: process.env.VERCEL_REGION,
        url: process.env.VERCEL_URL
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      error: error.message,
      stack: error.stack
    });
  }
};
