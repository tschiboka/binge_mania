const mongoose = require("mongoose");
const Joi = require("joi");



const transactionSchema = mongoose.Schema({
    "movies": {
        "type": Array,
        "required": true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    "user": {
        type: {},
        "required": true
    },
    "transTotal": {
        "type": Number,
        "required": true,
        "min": 0
    }
});



const Transaction = new mongoose.model("Transaction", transactionSchema);



const validateTransaction = transaction => Joi.validate(transaction, {
    movies: Joi.array().items(Joi.string().required()),
    user: Joi.object().required(),
    transTotal: Joi.number().required().min(0)
});



module.exports.Transaction = Transaction;
module.exports.validate = validateTransaction();