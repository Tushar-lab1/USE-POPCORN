import { useState, useEffect } from "react";

const key = process.env.REACT_APP_OMDB_KEY;

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      async function fetchMovies() {
        if (query.length < 3) return;
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${key}&s=${query}`
          );
          if (!res.ok)
            throw new Error("Something went wrong while fetching the movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          // console.log(data.Search);
          setIsLoading(false);
        } catch (err) {
          console.error(err.message);
          setIsLoading(false);
          setError(err.message);
        }
      }
      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    },
    [query]
  );

  return { movies, isLoading, error };
}
