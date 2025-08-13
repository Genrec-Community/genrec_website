// PostgreSQL Database Initialization Script
const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default database first
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const dbName = process.env.DB_NAME || 'genrec_ai';

async function initializeDatabase() {
  console.log('🐘 Initializing PostgreSQL database for Genrec AI...\n');

  try {
    // Step 1: Create database if it doesn't exist
    console.log('1. Creating database...');
    try {
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`✅ Database '${dbName}' already exists`);
      } else {
        throw error;
      }
    }

    // Step 2: Connect to the new database
    console.log('\n2. Connecting to database...');
    const dbPool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: dbName,
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    });

    // Step 3: Create tables
    console.log('\n3. Creating tables...');

    // Users table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Contacts table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        project_type VARCHAR(100),
        budget VARCHAR(100),
        timeline VARCHAR(100),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contacts table created');

    // Conversations table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        user_email VARCHAR(255),
        user_name VARCHAR(255),
        user_agent TEXT,
        ip_address INET,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Conversations table created');

    // Messages table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        message_id VARCHAR(255),
        sender VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Messages table created');

    // Feedback table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        message_id VARCHAR(255),
        rating INTEGER CHECK (rating >= 1 AND rating <= 10),
        feedback_text TEXT,
        user_email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Feedback table created');

    // Analytics table
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        user_email VARCHAR(255),
        session_id VARCHAR(255),
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Analytics table created');

    // Step 4: Create indexes
    console.log('\n4. Creating indexes for performance...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)',
      'CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id)',
      'CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)',
      'CREATE INDEX IF NOT EXISTS idx_feedback_conversation_id ON feedback(conversation_id)',
      'CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type)',
      'CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)'
    ];

    for (const indexQuery of indexes) {
      await dbPool.query(indexQuery);
    }
    console.log('✅ All indexes created');

    // Step 5: Insert sample data (optional)
    console.log('\n5. Checking for existing data...');
    const contactCount = await dbPool.query('SELECT COUNT(*) FROM contacts');
    
    if (parseInt(contactCount.rows[0].count) === 0) {
      console.log('📝 Inserting sample data...');
      
      // Sample contact
      await dbPool.query(`
        INSERT INTO contacts (name, email, phone, company, project_type, budget, message)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        'Sample User',
        'sample@example.com',
        '+1234567890',
        'Sample Company',
        'Web Development',
        '$10,000 - $25,000',
        'This is a sample contact submission to test the system.'
      ]);

      // Sample analytics event
      await dbPool.query(`
        INSERT INTO analytics (event_type, event_data)
        VALUES ($1, $2)
      `, [
        'system_initialization',
        JSON.stringify({ message: 'Database initialized successfully', timestamp: new Date() })
      ]);

      console.log('✅ Sample data inserted');
    } else {
      console.log(`✅ Found ${contactCount.rows[0].count} existing contacts`);
    }

    // Step 6: Test database connection
    console.log('\n6. Testing database connection...');
    const testResult = await dbPool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Database connection successful');
    console.log(`   Current time: ${testResult.rows[0].current_time}`);
    console.log(`   PostgreSQL version: ${testResult.rows[0].pg_version.split(' ')[0]} ${testResult.rows[0].pg_version.split(' ')[1]}`);

    await dbPool.end();
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the backend: node postgresql-server.js');
    console.log('2. Start the frontend: cd ../frontend && npm start');
    console.log('3. Test all forms - data will be saved to PostgreSQL!');
    console.log('\n🔍 View your data:');
    console.log(`   - Admin dashboard: http://localhost:5000/api/admin/dashboard`);
    console.log(`   - All contacts: http://localhost:5000/api/admin/contacts`);
    console.log(`   - Database direct: psql -U ${process.env.DB_USER || 'postgres'} -d ${dbName}`);

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Make sure PostgreSQL is running');
    console.error('2. Check your database credentials in .env file');
    console.error('3. Ensure the database user has proper permissions');
    console.error(`4. Try connecting manually: psql -U ${process.env.DB_USER || 'postgres'} -h ${process.env.DB_HOST || 'localhost'}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
