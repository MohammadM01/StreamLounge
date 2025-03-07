# StreamLounge 🎬

StreamLounge is a modern movie discovery platform that helps users find and track trending movies. Built with React for the frontend and Node.js/Express for the backend, it provides a seamless movie browsing experience.

## Features ✨

- Real-time movie search
- Trending movies tracking
- Responsive movie grid layout
- Movie poster display
- Search history tracking
- Popular movies showcase

## Tech Stack 🛠️

### Frontend
- React
- Vite
- Axios
- React-use (for debouncing)
- CSS3 with modern styling

### Backend
- Node.js
- Express
- PostgreSQL
- CORS

### API
- TMDB (The Movie Database) API

## Prerequisites 📋

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Installation & Setup 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/StreamLounge.git
   cd StreamLounge
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the frontend directory:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Configure PostgreSQL connection in `server.js`:
   ```javascript
   const client = new Client({
     user: "postgres",
     host: "localhost",
     database: "mydatabase",
     password: "postgres",
     port: 5432,
   });
   ```

4. **Database Setup**
   - Create a PostgreSQL database named `mydatabase`
   - The tables will be automatically created when the server starts

## Running the Application 🏃‍♂️

1. **Start the Backend Server**
   ```bash
   cd backend
   node server.js
   ```
   The server will run on http://localhost:5000

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at http://localhost:5173

## API Endpoints 🔌

### Backend Endpoints
- `GET /trending` - Get trending movies
- `POST /update` - Update movie search count

### TMDB API Integration
- Movie Search
- Popular Movies
- Movie Details

## Acknowledgments 🙏

- [TMDB API](https://www.themoviedb.org/documentation/api) for providing movie data
- [React Documentation](https://reactjs.org/)
- [Express Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/)
