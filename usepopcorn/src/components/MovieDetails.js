import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";

const key = process.env.REACT_APP_OMDB_KEY;

export default function Moviedetails({
  selectedId,
  onCloseMovie,
  favourites,
  userId,
}) {
  const [movie, setMovie] = useState({});
  const [isloading, setisloading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const countRef = useRef(0);
  useEffect(() => {
    if (userRating) {
      countRef.current = countRef.current + 1;
    }
  }, [userRating]);

  const iswatched = favourites
    .map((movie) => movie.imdbID)
    .includes(selectedId);
  const rated = favourites.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(() => {
    const controller = new AbortController();

    async function getMovieDetails() {
      try {
        setisloading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${key}&i=${selectedId}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setMovie(data);
        setisloading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch movie details:", err.message);
          setisloading(false);
        }
      }
    }

    getMovieDetails();

    return () => controller.abort();
  }, [selectedId]);

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `MOVIE | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  const handleAdd = async () => {
    if (!userId) {
      alert("Please log in to save favorites.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          movieId: selectedId,
          rating: userRating,
        }),
      });

      const data = await res.json();
      console.log(data);
      alert(data.message || "Movie saved successfully!");
    } catch (error) {
      console.error("Error saving movie:", error);
      alert("Failed to save movie.");
    }
  };

  return (
    <div className="details">
      {isloading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={title} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            {!iswatched ? (
              <>
                <div className="rating">
                  <StarRating
                    maxRating={10}
                    size={2}
                    onSetRating={setUserRating}
                    withState={true}
                  />
                </div>
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    + Add to list
                  </button>
                )}{" "}
              </>
            ) : (
              <p>You rated this movie {rated} ⭐</p>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
