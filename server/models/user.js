const Joi = require("joi");
const mongoose = require("mongoose");



const userSchema = mongoose.Schema({
    name: { type: String, required: true, maxlength: 20, minlength: 3, trim: true },
    isAdmin: { type: Boolean, default: false },
    password: { type: String, required: true, minlength: 8, maxlength: 200, trim: true }, // no maxlength, password will be crypted
    email: { type: String, required: true, unique: true, trim: true },
    transactions: [String]
});



const User = new mongoose.model("User", userSchema);



const validateUser = user => {
    return Joi.validate(user, {
        name: Joi.string().required().max(20).min(3),
        isAdmin: Joi.boolean().default(false),
        password: Joi.string().required().max(20).min(8),
        email: Joi.string().required().email(),
        transactions: Joi.array()
    });
}



module.exports.User = User;
module.exports.validate = validateUser;