const express = require("express");
const pkg = require("pg");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const { Client } = pkg;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "mydatabase",
  password: "postgres",
  port: 5432,
});

client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Database connection error:", err));

app.get("/trending", async (req, res) => {
  try {
    // First check if the table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'movies'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      // Create the table if it doesn't exist
      await client.query(`
        CREATE TABLE movies (
          id SERIAL PRIMARY KEY,
          searchTerm VARCHAR(255) UNIQUE,
          movie_id VARCHAR(50),
          poster_url TEXT,
          count INTEGER DEFAULT 1
        );
      `);
    }

    const query = "SELECT * FROM movies ORDER BY count DESC LIMIT 10";
    console.log("Executing query:", query);
    const result = await client.query(query);
    console.log("Trending Movies:", result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Detailed error in /trending:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      error: "Server error while fetching trending movies",
      details: error.message
    });
  }
});

app.post("/update", async (req, res) => {
  const { searchTerm, movieId, posterUrl } = req.body;

  if (!searchTerm || !movieId || !posterUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // First update/insert the movie
    const updateQuery = `
      INSERT INTO movies (searchTerm, count, poster_url, movie_id)
      VALUES ($1, 1, $2, $3)
      ON CONFLICT (searchTerm) 
      DO UPDATE SET count = movies.count + 1
      RETURNING *;
    `;
    await client.query(updateQuery, [searchTerm, posterUrl, movieId]);

    // Then fetch the latest trending movies
    const trendingQuery = "SELECT * FROM movies ORDER BY count DESC LIMIT 10";
    const trendingResult = await client.query(trendingQuery);
    
    res.json({
      message: "Update successful",
      trendingMovies: trendingResult.rows
    });
  } catch (error) {
    console.error("Error updating search count:", error);
    res.status(500).json({ error: "Server error while updating movie count" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
