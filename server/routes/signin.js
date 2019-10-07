const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");



router.get("/:user_name", async (req, res) => {
    try {
        const user = await User.findOne({ name: req.params.user_name });

        console.log(user);
        res.send(user);
    } catch (err) { res.status(500).send(`Error while getting user ${req.params.id}.\n${err}`) }
});



module.exports = router;