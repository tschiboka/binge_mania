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
        lowercase: true
    },
    coverImgUrl: {
        type: String,
        default: "none"
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlenght: 300,
        trim: true
    },
    genres: {
        type: [genreSchema],
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
        max: 240
    },
    lang: {
        type: String,
        minlength: 1,
        maxlength: 10,
        trim: true
    },
    cast: [String]
});



const Movie = new mongoose.model("Movie", movieSchema);



const validateMovie = movie => Joi.validate(movie, {
    title: Joi.string().required().min(1).max(100),
    coverImgUrl: Joi.string(),
    description: Joi.string().required().min(10).max(300),
    genreIds: Joi.array().items(Joi.string().required()),
    year: Joi.number().required().min(1900).max(new Date().getFullYear()),
    time: Joi.number().required().min(1).max(240),
    lang: Joi.string().min(1).max(10)
})



module.exports.validate = validateMovie;
module.exports.Movie = Movie;