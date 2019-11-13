const express = require("express");
const route = express.Router();
const { Transaction, validate } = require("../models/transaction");
const { User } = require("../models/user");
const { Movie } = require("../models/movie");
const mongoose = require("mongoose");
const Fawn = require("fawn");



Fawn.init(mongoose);



route.get("/", async (req, res) => {
    res.send("TRANS");
});



route.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.body.user._id);
        if (!user) return res.status(400).send("No user with the given id " + req.body.user._id);

        const transaction = new Transaction({
            movies: req.body.movies,
            transTotal: req.body.transTotal,
            user: { id: user._id, email: user.email }
        });

        const movieIds = req.body.movies.map(m => mongoose.Types.ObjectId(m._id)); // cast to mdb id

        // FAWN transaction here (an easier implementation of 2 phase commit)
        new Fawn.Task()
            .save("transactions", transaction) // we need to use the actual name of the collection
            .update("users", { _id: user._id }, { $push: { transactions: transaction._id } })
            .update("movies", { _id: { $in: [...movieIds] } }, { $inc: { inStock: -1 } })
            .options({ multi: true })
            .run();

        res.send(transaction);
    } catch (err) { res.status(500).send("ERROR: " + err) }
});



module.exports = route;