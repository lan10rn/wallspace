# WallSpace - Wallpaper Discovery App

A full-stack application for discovering and browsing beautiful wallpapers from Wallhaven.

## Project Structure

```
wallspace/
├── frontend/          # React application (port 3000)
├── backend/           # Express server (port 5000)
├── package.json
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

**Development mode** (with hot reload):
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd ..  # Go back to root
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## How It Works

1. **Frontend** → Makes API requests to the backend at `http://localhost:5000/api/wallpapers`
2. **Backend** → Receives the request and forwards it to Wallhaven API
3. **Backend** → Returns the response to frontend (CORS policy is handled server-to-server, avoiding browser restrictions)
4. **Frontend** → Displays wallpapers to the user

## Available Endpoints

### Backend API

- **GET** `/api/wallpapers` - Search for wallpapers
  - Query Parameters:
    - `q` - Search query (default: 'abstract')
    - `categories` - Categories filter (default: '111')
    - `purity` - Purity filter (default: '100')
    - `sorting` - Sort by (default: 'date_added')
    - `order` - Order (default: 'desc')
    - `per_page` - Results per page (default: '24')

- **GET** `/health` - Health check endpoint

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
```

## Troubleshooting

### CORS Error
- Make sure backend is running on port 5000
- Make sure frontend is using `http://localhost:5000` in API calls

### Connection Refused
- Check if backend server is running: `http://localhost:5000/health`
- Check if frontend is running: `http://localhost:3000`

### No results from search
- Try different search queries
- Check browser console for error messages
- Verify Wallhaven API is accessible

## Technologies Used

### Frontend
- React 19
- React Router DOM
- CSS3

### Backend
- Express.js
- Node.js
- CORS
- Dotenv

## License
ISC
