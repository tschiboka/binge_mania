const Joi = require("joi");
const mongoose = require("mongoose");



const userSchema = mongoose.Schema({
    name: { type: String, required: true, maxlength: 50, minlength: 3 },
    isAdmin: { type: Boolean, default: false },
    password: { type: String, required: true, maxlength: 50, minlength: 8 },
    email: { type: String, required: true },
    transactions: [String]
});



const User = new mongoose.model("User", userSchema);



const validateUser = user => {
    return Joi.validate(user, {
        name: Joi.string().required().max(50).min(3),
        isAdmin: Joi.boolean().default(false),
        password: Joi.string().required().max(50).min(8),
        email: Joi.string().required().email(),
        transactions: Joi.array()
    });
}



module.exports.User = User;
module.exports.validate = validateUser;