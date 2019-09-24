const express = require("express");
const router = express.Router();

router.get("/", (req, res) => { res.send("HEY TIBS"); });

module.exports = router;