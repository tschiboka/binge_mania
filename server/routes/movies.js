const express = require("express");
const route = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");



route.get("/", (req, res) => {
    res.send("movies");
});



route.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        console.log(req.body.genreIds);
        // validate genres
        const genres = await Promise.all(
            req.body.genreIds
                .map(async genreId => await Genre.findById(genreId)));
        console.log(genres);
        res.send(genres);

        const movie = new Movie(req.body);
        console.log("POSTING...");
        res.send("Post movies");
    } catch (err) { res.status(500).send(`Error while posting new Movie\n${err}`) }
});



module.exports = route;