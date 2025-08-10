# 🐘 PostgreSQL Setup for Genrec AI - Production Ready

## 🎯 Why PostgreSQL is Better

### **Current (In-Memory):**
- ❌ Data lost when server restarts
- ❌ No concurrent access
- ❌ Limited to single server
- ❌ No backup/recovery
- ❌ No advanced queries

### **PostgreSQL (Production):**
- ✅ **Permanent storage** - Data persists forever
- ✅ **ACID compliance** - Data integrity guaranteed
- ✅ **Concurrent users** - Multiple simultaneous access
- ✅ **Scalability** - Handles millions of records
- ✅ **Advanced analytics** - Complex queries and reporting
- ✅ **Backup & recovery** - Professional data protection
- ✅ **Security** - Built-in authentication and encryption

---

## 🛠️ Installation Steps

### **Step 1: Install PostgreSQL**

#### **Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer and follow setup wizard
3. Remember the password you set for `postgres` user
4. Default port: 5432

#### **macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create database user
createuser -s postgres
```

#### **Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **Step 2: Create Database**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE genrec_ai;

# Create user (optional)
CREATE USER genrec_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE genrec_ai TO genrec_user;

# Exit
\q
```

### **Step 3: Install Node.js Dependencies**
```bash
cd backend
npm install pg
```

### **Step 4: Configure Environment**
```bash
# Copy PostgreSQL environment file
cp .env.postgresql .env

# Edit .env file with your database credentials
# Update DB_PASSWORD with your PostgreSQL password
```

### **Step 5: Start PostgreSQL Backend**
```bash
cd backend
node postgresql-server.js
```

---

## 🚀 Quick Start (If PostgreSQL Already Installed)

```bash
# Terminal 1 - Start PostgreSQL Backend
cd backend
npm install pg
cp .env.postgresql .env
# Edit .env with your PostgreSQL password
node postgresql-server.js

# Terminal 2 - Start Frontend
cd frontend
npm start
```

---

## 📊 Database Schema

The PostgreSQL backend automatically creates these tables:

### **1. contacts** - Contact form submissions
```sql
- id (Primary Key)
- name, email, phone, company
- project_type, budget, timeline
- message, status, notes
- created_at, updated_at
```

### **2. conversations** - Chatbot sessions
```sql
- id (Primary Key)
- session_id (Unique)
- user_email, user_name
- user_agent, ip_address
- status, created_at, updated_at
```

### **3. messages** - Chat messages
```sql
- id (Primary Key)
- conversation_id (Foreign Key)
- message_id, sender, content
- created_at
```

### **4. feedback** - User ratings and feedback
```sql
- id (Primary Key)
- conversation_id (Foreign Key)
- message_id, rating (1-10)
- feedback_text, user_email
- created_at
```

### **5. analytics** - User interactions and tracking
```sql
- id (Primary Key)
- event_type, event_data (JSON)
- user_email, session_id
- ip_address, user_agent
- created_at
```

### **6. users** - User management (future use)
```sql
- id (Primary Key)
- email (Unique), name
- created_at, updated_at
```

---

## 🔍 Accessing Your Data

### **1. Admin Dashboard API:**
- **Dashboard**: `http://localhost:5000/api/admin/dashboard`
- **All Contacts**: `http://localhost:5000/api/admin/contacts`
- **All Feedback**: `http://localhost:5000/api/admin/feedback`
- **All Conversations**: `http://localhost:5000/api/admin/conversations`

### **2. Direct Database Access:**
```bash
# Connect to database
psql -U postgres -d genrec_ai

# View all contacts
SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10;

# View feedback with ratings
SELECT rating, feedback_text, created_at FROM feedback ORDER BY created_at DESC;

# View conversation statistics
SELECT COUNT(*) as total_conversations, 
       COUNT(DISTINCT user_email) as unique_users 
FROM conversations;

# Exit
\q
```

### **3. Advanced Analytics Queries:**
```sql
-- Contact conversion by project type
SELECT project_type, COUNT(*) as count 
FROM contacts 
GROUP BY project_type 
ORDER BY count DESC;

-- Average rating by day
SELECT DATE(created_at) as date, AVG(rating) as avg_rating 
FROM feedback 
GROUP BY DATE(created_at) 
ORDER BY date DESC;

-- Most active users
SELECT user_email, COUNT(*) as conversations 
FROM conversations 
WHERE user_email IS NOT NULL 
GROUP BY user_email 
ORDER BY conversations DESC;
```

---

## 🔧 Configuration Options

### **Environment Variables (.env):**
```bash
# Database Connection
DB_HOST=localhost          # Database server
DB_PORT=5432              # PostgreSQL port
DB_NAME=genrec_ai         # Database name
DB_USER=postgres          # Database user
DB_PASSWORD=your_password # Database password

# Server Configuration
PORT=5000                 # Backend server port
NODE_ENV=development      # Environment mode
```

### **Production Settings:**
```bash
# For production deployment
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PASSWORD=strong-production-password
JWT_SECRET=very-secure-random-string
```

---

## 🎯 Benefits You Get

### **Data Persistence:**
- ✅ All form submissions saved permanently
- ✅ Complete conversation history
- ✅ User feedback and ratings
- ✅ Analytics and interaction tracking

### **Professional Features:**
- ✅ **Concurrent access** - Multiple users simultaneously
- ✅ **Data integrity** - ACID compliance
- ✅ **Advanced queries** - Complex analytics
- ✅ **Backup/restore** - Professional data protection
- ✅ **Scalability** - Handles growth

### **Business Intelligence:**
- ✅ **Customer analytics** - User behavior insights
- ✅ **Conversion tracking** - Form submission rates
- ✅ **Satisfaction metrics** - Feedback analysis
- ✅ **Performance monitoring** - System usage stats

---

## 🚀 Ready for Production!

Your Genrec AI website now has:
- ✅ **Enterprise-grade database** (PostgreSQL)
- ✅ **Permanent data storage** (no data loss)
- ✅ **Professional analytics** (business insights)
- ✅ **Scalable architecture** (handles growth)
- ✅ **Data security** (ACID compliance)

**Start with: `node postgresql-server.js` and enjoy professional data management! 🎉**
