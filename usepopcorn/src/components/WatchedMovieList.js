import { useEffect } from "react";
import WatchedMovie from "./WatchedMovie";

export default function WatchedMovieList({
  ondeleteMovie,
  setfavourite,
  favourite,
}) {
  useEffect(() => {
    const getmovies = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await fetch(`https://usepopcorn-server.onrender.com/movies/${userId}`);
        const data = await res.json();

        const detailedMovies = await Promise.all(
          data.movies.map(async (movie) => {
            const res = await fetch(
              `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_KEY}&i=${movie.movieId}`
            );
            const details = await res.json();
            return {
              ...details,
              userRating: movie.rating,
              movieId: movie.movieId,
            };
          })
        );

        setfavourite(detailedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    getmovies();
  }, [setfavourite]);

  return (
    <ul className="list">
      {favourite.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.movieId}
          ondeleteMovie={ondeleteMovie}
        />
      ))}
    </ul>
  );
}
