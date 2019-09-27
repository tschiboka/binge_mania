const mongoose = require("mongoose");
const Joi = require("joi");



const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 15
    }
});



validateGenre = genre => Joi.validate(genre, {
    name: Joi.string().required().min(3).max(15)
});



const Genre = mongoose.model("Genre", genreSchema);



module.exports.Genre = Genre;
module.exports.validate = validateGenre;