const express = require("express");
const router = express.Router();



router.get("/", (req, res) => {
    res.send("Get user");
});



router.post("/", (req, res) => {
    res.send("Post user");
});



module.exports = router;