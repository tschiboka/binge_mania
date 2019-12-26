const express = require("express");
const route = express.Router();
const fetch = require("node-fetch");
require('dotenv').config();



route.get("/:id", async (req, res) => {
    try {
        const URL = "https://api.themoviedb.org/3/movie/";
        const APIKEY = process.env.TMDB_API_KEY;
        const id = req.params.id;
        const response = await fetch(`${URL}${id}?api_key=${APIKEY}&append_to_response=credits`);
        const json = await response.json();

        res.send(json);
    } catch (error) { console.log(err); }
});



module.exports = route;