const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");



router.get("/", async (req, res) => {
    try {
        let genres = await Genre.find().sort({ name: 1 })
        genres = JSON.stringify(genres);

        res.send(JSON.parse(genres));
    } catch (exp) { console.error("Error while getting Genres" + exp) }
});



router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send("Bad request body:\n" + error);

        const exist = await Genre.find({ name: req.body.name });
        if (exist.length) return res.status(400).send(`Genre ${req.body.name} already exist in db`);

        const genre = await new Genre(req.body);
        res.send(await genre.save());
    } catch (exp) { console.error("Error while posting new Genre:\n" + exp) }
});



router.put("/", async (req, res) => {
    try {
        if (!req.body.id) return res.status(400).send("Request body needs a genre id!");

        const genre = await Genre.findById(req.body.id);

        if (!genre) return res.status(400).send(`No genre on _id:${req.body.id}`);

        if (req.body.moviesWithGenre) genre.moviesWithGenre = req.body.moviesWithGenre;
        if (req.body.showInMenu) genre.showInMenu = req.body.showInMenu;

        res.send(await genre.save());
    } catch (err) { res.status(500).send(err); }
});



module.exports = router;