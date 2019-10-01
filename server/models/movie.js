const mongoose = require("mongoose");
const Joi = require("joi");



const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
    },
    coverImg: String,
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlenght: 300
    },
    genre: {
        type: String,
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear(),
    },
    time: {
        type: Number,
        required: true,
        min: 1,
        max: 240
    },
    lang: {
        type: String,
        minlength: 1,
        maxlength: 10
    },
    cast: [String]
});



const Movie = new mongoose.model("Movie", movieSchema);



module.exports.Movie = Movie;