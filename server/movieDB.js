import mongoose from "mongoose";
const movieSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
});

const MovieData = mongoose.model("MovieDB", movieSchema);
export default MovieData;
