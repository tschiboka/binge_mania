require('dotenv').config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const homeRoute = require("./routes/home");
const genresRoute = require("./routes/genres");
const usersRoute = require("./routes/users");
const moviesRoute = require("./routes/movies");
const signinRoute = require("./routes/signin");
const transactionsRoute = require("./routes/transactions");
const searchTitleRoute = require("./routes/searchTitle");
const searchMovieId = require("./routes/searchMovieId");
const mongoose = require("mongoose");
const DB_KEY = process.env.DB_PASSWORD;
const mongoConnectStr = `mongodb+srv://tschiboka:${DB_KEY}@cluster0-xwshl.mongodb.net/test?retryWrites=true&w=majority`;

console.log(process.env.TMDB_API_KEY);

mongoose.connect(mongoConnectStr, { useNewUrlParser: true })
    .then(() => console.log("Connected to binge_mania database..."))
    .catch(err => console.error("Error: Could not connect to db:\n" + err));



app.use(express.json());
app.use("/home", homeRoute);
app.use("/api/genres", genresRoute);
app.use("/api/users", usersRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/signin", signinRoute);
app.use("/api/searchtitle", searchTitleRoute);
app.use("/api/searchmovieid", searchMovieId);
app.use("/api/transactions", transactionsRoute);



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});