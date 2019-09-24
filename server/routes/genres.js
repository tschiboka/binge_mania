const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("GENRES");
    const genres = [
        "Comedy",
        "Horror",
        "Action",
        "Family",
        "Thriller"
    ];
    res.send(genres.join(","));
});

module.exports = router;