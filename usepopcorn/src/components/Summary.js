const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
export default function Summary({ favourite }) {
  const avgImdbRating = average(favourite.map((movie) => movie.imdbRating));
  const avgUserRating = average(favourite.map((movie) => movie.userRating));
  const avgRuntime = average(
    favourite.map((movie) => Number(movie.Runtime.split(" ")[0]))
  );
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{favourite.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
