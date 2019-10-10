const mongoose = require("mongoose");
const Joi = require("joi");



const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 25,
        lowercase: true,
        trim: true,
    },
    moviesWithGenre: {
        type: Number,
        default: 1,
        min: 0
    },
    showInMenu: {
        type: Boolean,
        default: true
    }
});



validateGenre = genre => Joi.validate(genre, {
    name: Joi.string().required().min(3).max(15),
    moviesWithGenre: Joi.number().min(0),
    showInMenu: Joi.boolean()
});



const Genre = mongoose.model("Genre", genreSchema);



module.exports.Genre = Genre;
module.exports.validate = validateGenre;