const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");



router.get("/", (req, res) => {
    res.send("Get user");
});



router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(`Error while posting User:\n${error.details[0].message}`);

        const user = new User(req.body);

        res.send(await user.save());
    } catch (err) { res.status(500).send(`Error while posting User:\n${err}`) }
});



module.exports = router;