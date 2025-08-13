#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Genrec AI Backend...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Create necessary directories
const directories = [
  'data',
  'logs',
  'uploads'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Copy .env.example to .env if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('📝 Created .env file from .env.example');
  console.log('⚠️  Please update the .env file with your configuration');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  console.error(error.message);
  process.exit(1);
}

// Initialize database
console.log('\n🗄️  Initializing database...');
try {
  const { initializeDatabase } = require('../config/database');
  await initializeDatabase();
  console.log('✅ Database initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize database');
  console.error(error.message);
  process.exit(1);
}

console.log('\n🎉 Backend setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update the .env file with your configuration');
console.log('2. Run "npm run dev" to start the development server');
console.log('3. Run "npm start" to start the production server');
console.log('\n🔗 API will be available at: http://localhost:5000');
console.log('📊 Admin dashboard will be available at: http://localhost:5000/admin');

// Create a simple start script
const startScript = `#!/bin/bash
echo "🚀 Starting Genrec AI Backend..."
cd "$(dirname "$0")"
npm start
`;

const startScriptPath = path.join(__dirname, '..', 'start.sh');
fs.writeFileSync(startScriptPath, startScript);
fs.chmodSync(startScriptPath, '755');
console.log('📜 Created start.sh script');

console.log('\n✨ Setup complete! Happy coding! ✨');
