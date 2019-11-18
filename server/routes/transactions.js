const express = require("express");
const route = express.Router();
const { Transaction, validate } = require("../models/transaction");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const Fawn = require("fawn");



Fawn.init(mongoose);



route.get("/", async (req, res) => {
    try {
        if (!req.body.limit && !req.body.page) return res.send(await Transaction.find());

        const posInt = n => !isNaN(Number(n)) && Number.isInteger(Number(n)) && Number(n) >= 1;
        if (!posInt(req.body.limit) || !posInt(req.body.page)) return res.status(400).send("Request body has invalid values!");

        res.send(await Transaction.find().skip((req.body.page - 1) * req.body.limit).limit(req.body.limit).select("date"));
    } catch (err) { res.status(500).send("Error " + err); }
});



route.get("/:userId", async (req, res) => {
    try {
        const { transactions } = await User.findById(req.params.userId).select("transactions");
        const userTransactions = await Promise.all(transactions.map(async trns => Transaction.findById(trns)));
        res.send(userTransactions);
    } catch (err) { res.status(500).send("Error " + err); }
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