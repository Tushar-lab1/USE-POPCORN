import { useEffect, useState } from "react";
import { useMovies } from "./components/useMovies";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import Logo from "./components/Logo";
import Search from "./components/Search";
import Result from "./components/Result";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Box from "./components/Box";
import MovieList from "./components/MovieList";
import Summary from "./components/Summary";
import WatchedMovieList from "./components/WatchedMovieList";
import Moviedetails from "./components/MovieDetails";
import { Link } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [favourite, setfavourite] = useState([]);
  const [userId, setuserId] = useState(null);

  const handleDeleteWatched = async (id) => {
    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch(`https://usepopcorn-server.onrender.com/movies/${userId}/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      alert(data.message);
      setfavourite((prev) => prev.filter((movie) => movie.movieId !== id));
    } catch (error) {
      console.log(error);
    }
  };

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setuserId(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (storedUser) {
      setuserId(storedUser);
    }
  }, []);

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Result movies={movies} />
        {userId ? (
          <button className="login" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="login">Login/Signup</button>
          </Link>
        )}
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectMovie={handleSelectMovie} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <Moviedetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              favourites={favourite}
              handleLogout={handleLogout}
              userId={userId}
            />
          ) : (
            <>
              <Summary favourite={favourite} />
              <WatchedMovieList
                ondeleteMovie={handleDeleteWatched}
                favourite={favourite}
                setfavourite={setfavourite}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
