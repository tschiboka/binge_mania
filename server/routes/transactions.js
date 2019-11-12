const express = require("express");
const route = express.Router();
const { Transaction, validate } = require("../models/transaction");



route.get("/", async (req, res) => {
    res.send("TRANS");
});



route.post("/", async (req, res) => {

    res.send(req.body);
});



module.exports = route;