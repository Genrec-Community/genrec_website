# 🚀 Genrec AI Backend Setup Guide

Complete backend infrastructure for customer data collection, chatbot conversations, and admin dashboard.

## 📋 What's Included

### ✅ **Backend Features:**
- **SQLite Database** with comprehensive schema
- **REST API** for all data operations
- **Real-time conversation tracking**
- **Contact form submissions**
- **Feedback collection system**
- **Admin dashboard APIs**
- **Analytics and reporting**
- **Data export functionality**
- **Offline support with fallbacks**

### ✅ **Frontend Integration:**
- **Updated Chatbot** to save to backend
- **Updated Contact Form** to submit to backend
- **API Service** with offline fallbacks
- **Admin Dashboard** component

## 🛠️ Installation Steps

### 1. **Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your settings
nano .env

# Run the setup script
node scripts/install.js

# Start the development server
npm run dev
```

### 2. **Frontend Integration**

The frontend has been updated to use the backend APIs. Make sure your `.env` file in the frontend contains:

```bash
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 3. **Database Schema**

The backend automatically creates these tables:
- **users** - Visitor information
- **conversations** - Chatbot sessions
- **messages** - Individual chat messages
- **contacts** - Contact form submissions
- **feedback** - User feedback and ratings
- **analytics** - Event tracking
- **admin_users** - Admin authentication

## 🔧 Configuration

### Environment Variables (.env)

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DB_PATH=./data/genrec.db

# JWT (for future admin auth)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 API Endpoints

### **Conversations**
- `POST /api/conversations` - Create conversation
- `POST /api/conversations/message` - Add message
- `GET /api/conversations/:sessionId` - Get conversation
- `PUT /api/conversations/:sessionId/end` - End conversation

### **Contacts**
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts/:id` - Get contact details
- `PUT /api/contacts/:id/status` - Update status

### **Feedback**
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/:id` - Get feedback
- `GET /api/feedback/conversation/:sessionId` - Get conversation feedback

### **Admin Dashboard**
- `GET /api/admin/dashboard` - Dashboard overview
- `GET /api/admin/conversations` - All conversations
- `GET /api/admin/contacts` - All contacts
- `GET /api/admin/feedback` - All feedback
- `GET /api/admin/users` - All users

### **Analytics**
- `GET /api/analytics/overview` - Analytics overview
- `GET /api/analytics/feedback` - Feedback analytics
- `GET /api/analytics/contacts` - Contact analytics
- `GET /api/analytics/export` - Export data

## 🎯 How to Access Your Data

### 1. **API Endpoints**
Access your data programmatically:
```bash
# Get dashboard overview
curl http://localhost:5000/api/admin/dashboard

# Get all contacts
curl http://localhost:5000/api/admin/contacts

# Export data as CSV
curl http://localhost:5000/api/analytics/export?type=contacts&format=csv
```

### 2. **Database Direct Access**
```bash
# Install SQLite CLI
npm install -g sqlite3

# Access database directly
sqlite3 backend/data/genrec.db

# Example queries
.tables
SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10;
SELECT * FROM conversations WHERE user_email IS NOT NULL;
SELECT AVG(rating) FROM feedback;
```

### 3. **Admin Dashboard**
- Add the AdminDashboard component to your React app
- Access at: `http://localhost:3000/admin`

## 📈 Data You Can Now Track

### **Customer Interactions:**
- ✅ Chatbot conversations with full message history
- ✅ User email collection and visitor tracking
- ✅ Contact form submissions with project details
- ✅ Feedback ratings and comments
- ✅ User session analytics

### **Business Insights:**
- ✅ Conversion rates (chat → contact)
- ✅ Customer satisfaction scores
- ✅ Popular project types and budgets
- ✅ Daily/weekly activity trends
- ✅ Response times and engagement

### **Export Options:**
- ✅ CSV export for Excel analysis
- ✅ JSON export for integrations
- ✅ Filtered data exports
- ✅ Automated reporting

## 🔒 Security Features

- **Rate limiting** to prevent abuse
- **Input validation** on all endpoints
- **SQL injection protection**
- **CORS configuration**
- **Error handling and logging**
- **Offline fallback storage**

## 🚀 Production Deployment

### **Environment Setup:**
1. Set `NODE_ENV=production`
2. Use a secure `JWT_SECRET`
3. Configure proper CORS origins
4. Set up SSL/HTTPS
5. Use PM2 or similar for process management

### **Database Backup:**
```bash
# Backup database
cp backend/data/genrec.db backup/genrec-$(date +%Y%m%d).db

# Restore database
cp backup/genrec-20241207.db backend/data/genrec.db
```

## 🎉 You're All Set!

Your customer data collection system is now fully operational:

1. **Start the backend:** `cd backend && npm run dev`
2. **Start the frontend:** `cd frontend && npm start`
3. **Test the chatbot** - conversations are now saved!
4. **Submit a contact form** - data goes to the database!
5. **Leave feedback** - ratings are tracked!
6. **Check the admin dashboard** - see all your data!

## 📞 Support

If you need help:
1. Check the logs in `backend/logs/`
2. Verify the database in `backend/data/genrec.db`
3. Test API endpoints with curl or Postman
4. Check browser console for frontend errors

**Happy data collecting! 🎯📊**
