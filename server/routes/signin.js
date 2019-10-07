const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");



router.get("/:user_name", async (req, res) => {
    try {
        const user = await User.findOne({ name: req.params.user_name });
        const match = await bcrypt.compare(req.body.password, user.password);

        user.password = undefined; // Don't return password
        console.log(user);
        res.send(match ? user : {});
    } catch (err) { res.status(500).send(`Error while getting user ${req.params.id}.\n${err}`) }
});



module.exports = router;