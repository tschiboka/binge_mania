const express = require("express");
const route = express.Router();
const { Movie, validate } = require("../models/movie");



route.get("/", (req, res) => {
    res.send("movies");
});



route.post("/", (req, res) => {
    console.log("POSTING...");
    res.send("Post movies");
});



module.exports = route;