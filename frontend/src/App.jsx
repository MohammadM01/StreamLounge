import React, { useEffect, useState } from "react";
import Search from "./Components/Search.jsx";
import Spinner from "./Components/Spinner.jsx";
import MovieCard from "./Components/MovieCard.jsx";
import { useDebounce } from "react-use";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = "https://api.themoviedb.org/3";
const BACKEND_URL = "http://localhost:5000"; // Your backend server URL

// Define API_OPTIONS correctly
const API_OPTIONS = {
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'accept': 'application/json'
  }
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const getTrendingMovies = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/trending`);
      return response.data;
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      throw error;
    }
  };

  const loadTrendingMovies = async () => {
    try {
      setIsLoading(true);
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error loading trending movies:", error);
      setErrorMessage("Failed to load trending movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTrendingMovie = async (movie) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/update`, {
        searchTerm: movie.title,
        movieId: movie.id.toString(),
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      });
      
      // Refresh trending movies after update
      await loadTrendingMovies();
      
      return response.data;
    } catch (error) {
      console.error("Error updating trending movie:", error);
      throw error;
    }
  };

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: API_OPTIONS.headers
      });

      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();
      setMovieList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies:`, error);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="overflow-hidden">
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.movie_id}>
                  <p>{index + 1}</p>
                  <img 
                    src={movie.poster_url} 
                    alt={movie.searchTerm}
                    onError={(e) => {
                      e.target.src = './placeholder.png'; // Add a placeholder image
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie}
                  onMovieClick={() => updateTrendingMovie(movie)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
