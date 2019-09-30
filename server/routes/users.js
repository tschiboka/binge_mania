const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");



router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.send(users);
    } catch (err) { res.status(500).send(`Error while getting users\n${err}`) }
});



router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        res.send(user);
    } catch (err) { res.status(500).send(`Error while getting user ${req.params.id}.\n${err}`) }
});



router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(`Error while posting User:\n${error.details[0].message}`);

        const user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        user.password = ""; // don't return password
        console.log(user);
        res.send(user);
    } catch (err) { res.status(500).send(`Error while posting User:\n${err}`) }
});



module.exports = router;