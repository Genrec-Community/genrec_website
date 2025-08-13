# Genrec Website

A modern, full-stack website for Genrec AI built with React and Express.js in a unified project structure.

## Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Optimized for all device sizes
- **Interactive Components**: Engaging user interface elements
- **Contact Forms**: Multiple ways for users to get in touch
- **Service Showcase**: Detailed presentation of AI services
- **Project Portfolio**: Display of completed projects
- **Admin Dashboard**: Backend management interface
- **Unified Structure**: Single project with integrated frontend and backend

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express.js
- **Database**: In-memory storage (configurable to PostgreSQL)
- **Build Tool**: Create React App
- **Development**: Concurrently for running both frontend and backend

## Quick Start

### Prerequisites
- Node.js 16+
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd genrec-website
```

2. Install all dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development:
```bash
# Start both frontend and backend in development mode
npm run dev
```

Or start them separately:
```bash
# Start only backend
npm run server:dev

# Start only frontend
npm run client:dev
```

5. Build for production:
```bash
npm run build
```

6. Start production server:
```bash
npm start
```

The application will be available at `http://localhost:5000` in production, or `http://localhost:3000` (frontend) and `http://localhost:5000` (backend) in development.

## Project Structure

```
genrec-website/
├── src/                     # React frontend source
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── public/                 # Static assets
├── server/                 # Express.js backend
│   ├── api/               # API route handlers
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── models/            # Data models
│   ├── routes/            # Route definitions
│   ├── utils/             # Utility functions
│   ├── server.js          # Main server file
│   └── index.js           # Server entry point
├── build/                 # Production build (generated)
├── package.json           # Unified dependencies
└── README.md
```

## Available Scripts

- `npm start` - Start production server (serves built React app)
- `npm run dev` - Start both frontend and backend in development mode
- `npm run client:dev` - Start only React development server
- `npm run client:build` - Build React app for production
- `npm run client:test` - Run React tests
- `npm run server:dev` - Start only backend with nodemon
- `npm run server:start` - Start only backend in production mode
- `npm run build` - Build React app for production

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration (optional - currently using in-memory storage)
# DATABASE_URL=postgresql://username:password@localhost:5432/genrec_db

# Frontend URL (for CORS in production)
FRONTEND_URL=http://localhost:5000

# React App Environment Variables
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Deployment

This unified structure makes deployment much simpler. You can deploy to any platform that supports Node.js:

### Heroku
1. Create a Heroku app
2. Set environment variables
3. Deploy with `git push heroku main`

### Railway/Render/DigitalOcean
1. Connect your repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

### VPS/Server
1. Clone repository
2. Run `npm install`
3. Run `npm run build`
4. Run `npm start`
5. Use PM2 or similar for process management

## Development

The project uses a proxy configuration to route API calls from the React development server to the Express backend. In production, the Express server serves the built React files directly.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
