const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");



const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 100,
        trim: true,
    },
    coverImgUrl: {
        type: String,
        default: "none"
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlenght: 1000,
        trim: true
    },
    genres: {
        type: [String],
        required: true,
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
        max: 600
    },
    lang: {
        type: String,
        minlength: 1,
        maxlength: 10,
        trim: true,
        lowercase: true
    },
    cast: [String],
    inStock: {
        type: Number,
        min: 0,
        default: 0
    }
});



const Movie = new mongoose.model("Movie", movieSchema);



const validateMovie = movie => Joi.validate(movie, {
    title: Joi.string().required().min(1).max(100),
    coverImgUrl: Joi.string(),
    description: Joi.string().required().min(10).max(1000),
    genres: Joi.array().items(Joi.string().required()),
    year: Joi.number().required().min(1900).max(new Date().getFullYear()),
    time: Joi.number().required().min(1).max(600),
    lang: Joi.string().min(1).max(10),
    cast: Joi.array(),
    inStock: Joi.string().min(0)
});



module.exports.validate = validateMovie;
module.exports.Movie = Movie;