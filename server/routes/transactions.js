const express = require("express");
const route = express.Router();
const { Transaction, validate } = require("../models/transaction");
const { User } = require("../models/user");



route.get("/", async (req, res) => {
    res.send("TRANS");
});



route.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.body.user._id);


        res.send(user);
    } catch (err) { res.status(500).send("ERROR: " + err) }
});



module.exports = route;