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
        const genres = await Promise.all(
            req.body.genreIds
                .map(async genreId => await Genre.findById(genreId)));


        const movie = new Movie({
            title: req.body.title,
            description: req.body.description,
            genres: genres,
            year: req.body.year,
            time: req.body.time,
            coverImgUrl: req.body.coverImgUrl,
            cast: req.cast
        });

        res.send(movie);
    } catch (err) { res.status(500).send(`Error while posting new Movie\n${err}`) }
});



module.exports = route;