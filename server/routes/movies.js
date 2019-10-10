const express = require("express");
const route = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre, validateGenre } = require("../models/genre");
const fetch = require("node-fetch");



route.get("/", (req, res) => {
    res.send("movies");
});



route.post("/", async (req, res) => {
    console.log(req.body);
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //search for genres and create if not found update if did found
        const genres = await Promise.all(
            req.body.genres
                .map(async (genre, i) => {
                    const dbGenre = await Genre.find({ name: genre.toLowerCase() });

                    if (!dbGenre.length) {
                        const newGenre = new Genre({ name: genre.toLowerCase() });
                        await newGenre.save();
                        return newGenre.name;
                    }
                    const upDateGenre = await dbGenre[0].update({ $inc: { moviesWithGenre: 1 } });
                    return genre;
                }));

        const movie = new Movie({
            title: req.body.title,
            description: req.body.description,
            genres: genres,
            year: req.body.year,
            time: req.body.time,
            coverImgUrl: req.body.coverImgUrl,
            cast: req.body.cast
        });


        res.send(await movie.save());
    } catch (err) { res.status(500).send(`Error while posting new Movie\n${err}`) }
});



module.exports = route;