const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");



router.post("/:user_name", async (req, res) => {
    try {
        const user = await User.findOne({ name: req.params.user_name });
        if (!user) return res.send("");
        const match = await bcrypt.compare(req.body.password, user.password);

        user.password = user.__v = undefined; // Don't return password
        res.send(match ? JSON.stringify(user) : "");
    } catch (err) { res.status(500).send(`Error while getting user ${req.params.id}.\n${err}`) }
});



module.exports = router;