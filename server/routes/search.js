const express = require("express");
const route = express.Router();
const fetch = require("node-fetch");

route.get("/:search", async (req, res) => {
    const URL = "https://api.themoviedb.org/3/search/movie?";
    const APIKEY = process.env.TMDB_API_KEY;
    const search = req.params.search;
    const page = req.query.page || 1;

    try {
        const response = await fetch(`${URL}api_key=${APIKEY}&query=${search}&page=${page}`);
        const searchRes = await response.json();

        res.send(searchRes.results.map(movie => ({ title: movie.title, tmdb_id: movie.id })));
    } catch (err) { console.log(err) }
});

module.exports = route;