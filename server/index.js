const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const homeRoute = require("./routes/home");
const genresRoute = require("./routes/genres");
const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/binge_mania", { useNewUrlParser: true })
    .then(() => console.log("Connected to binge_mania database..."))
    .catch(err => console.error("Error: Could not connect to db:\n" + err));



app.use(express.json());
app.use("/home", homeRoute);
app.use("/api/genres", genresRoute);



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});