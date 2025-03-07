import { Client } from "pg";

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "mydatabase",
  password: "postgres",
  port: 5432,
});

client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Database connection error:", err));

export const updateSearchCountInDB = async (searchTerm, movieId, posterUrl) => {
  try {
    const query = `
      INSERT INTO movies (searchTerm, count, poster_url, movie_id)
      VALUES ($1, 1, $2, $3)
      ON CONFLICT (searchTerm) 
      DO UPDATE SET count = movies.count + 1;
    `;
    await client.query(query, [searchTerm, posterUrl, movieId]);
    console.log(`Updated search count for: ${searchTerm}`);
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

export const getTrendingMoviesFromDB = async () => {
  try {
    const res = await client.query("SELECT * FROM movies ORDER BY count DESC LIMIT 10");
    return res.rows;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};
