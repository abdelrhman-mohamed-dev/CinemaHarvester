const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const configureBrowser = require("./src/browserConfig");
const scrapeWebsiteFashelHD = require("./src/websites/fashelhd");
const MovieModel = require("./src/models/MovieModel");

const app = express();
// Middleware to parse JSON in the request body
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// Middleware to log IP addresses
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(`IP Address: ${ip}`);
  next();
});

let browserDriver;

// Start browser configuration when the app starts
async function initializeBrowser() {
  browserDriver = await configureBrowser();
}

// Initialize the browser when the app starts
initializeBrowser();

app.get("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  res.json({
    greeting: "Hello, I am working!",
    ip: ip,
  });
});

app.post("/scrape", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const movieName = req.body.movieName;

  try {
    // Check if the movie title exists in the database
    const existingMovie = await MovieModel.findOne({ title: movieName });

    if (existingMovie) {
      // If the movie exists in the database, return it
      res.json({
        downloadLink: existingMovie.fashelHD,
        movieTitle: existingMovie.title,
      });
    } else {
      // If the movie doesn't exist, proceed with scraping
      const scrapedMovie = await scrapeWebsiteFashelHD(
        browserDriver,
        movieName
      );

      // Save the new movie details to the database
      const newMovie = new MovieModel({
        title: scrapedMovie.movieTitle,
        fashelHD: scrapedMovie.downloadLink,
        ip: ip,
      });
      await newMovie.save();

      res.json({
        downloadLink: scrapedMovie.downloadLink,
        movieTitle: scrapedMovie.movieTitle,
      });
    }
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
