const express = require("express");
const route = express.Router();

route.get("/:search", (req, res) => {
    console.log(req.params.search);

    res.send(req.params.search);
});

module.exports = route;