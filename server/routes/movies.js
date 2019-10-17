const express = require("express");
const route = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre, validateGenre } = require("../models/genre");



route.get("/:title", async (req, res) => {
    try {
        const movie = await Movie.findOne({ title: req.params.title });

        console.log(movie);
        res.send(movie);
    } catch (err) { res.status(500).send(err); }
});



route.get("/", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.send(movies);
    } catch (error) { res.status(500).send(err); }
});



route.post("/", async (req, res) => {
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
                    await dbGenre[0].update({ $inc: { moviesWithGenre: 1 } });
                    return genre;
                }));

        const movie = new Movie({
            title: req.body.title,
            description: req.body.description,
            genres: genres,
            year: req.body.year,
            time: req.body.time,
            coverImgUrl: req.body.coverImgUrl,
            cast: req.body.cast,
            inStock: Math.floor(Math.random() * 200)
        });

        res.send(await movie.save());
    } catch (err) { res.status(500).send(`Error while posting new Movie\n${err}`) }
});



module.exports = route;