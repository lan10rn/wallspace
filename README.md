# WallSpace - Wallpaper Discovery App

A full-stack application for discovering and browsing beautiful wallpapers from Wallhaven.

## Project Structure

```
wallspace/
├── frontend/          # React application (port 3000)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
├── backend/           # Express server (port 5000)
│   ├── server.js
│   ├── package.json
│   └── .env
└── SETUP.md
```

## Quick Start

### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## Full Documentation

See [SETUP.md](SETUP.md) for detailed setup instructions, API documentation, and troubleshooting.

## Architecture

- **Frontend** → Makes requests to backend at `http://localhost:5000/api/wallpapers`
- **Backend** → Proxies requests to Wallhaven API (handles CORS)
- **Response Flow** → Wallhaven API → Backend → Frontend → User

## Technologies

**Frontend:** React 19, React Router DOM, CSS3  
**Backend:** Express.js, Node.js, CORS

## License

ISC
