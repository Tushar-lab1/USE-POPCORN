import express from "express";
import connectDB from "./database.js";
import User from "./db.js";
import MovieData from "./movieDB.js";
import cors from "cors";
import dotenv from "dotenv";
const app = express();

app.use(express.json());
app.use(cors());
connectDB();
dotenv.config();
const PORT = process.env.PORT;
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
        success: false,
      });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    };

    return res.status(200).json({
      message: "Welcome Back",
      user: userData,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    return res.status(200).json({
      message: "User created successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/movies", async (req, res) => {
  try {
    const { userId, movieId, rating } = req.body;

    const exists = await MovieData.findOne({ userId, movieId });
    if (exists) {
      return res.json({ message: "Movie already in favorites" });
    }

    const movie = new MovieData({ userId, movieId, rating });
    await movie.save();

    res.json({ success: true, message: "Movie saved!", movie });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving movie" });
  }
});

app.get("/movies/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const movies = await MovieData.find({ userId });
    res.status(200).json({ movies, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
});

app.delete("/movies/:userId/:movieId", async (req, res) => {
  try {
    const { userId, movieId } = req.params;
    await MovieData.findOneAndDelete({ userId, movieId });
    return res.status(200).json({
      message: "Movie successfully deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Some error occured",
      success: false,
    });
  }
});

app.listen(PORT, () => {
  console.log("App listen on port : ", PORT);
});
