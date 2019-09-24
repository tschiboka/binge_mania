const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.get("/api/greeting", (req, res) => {
    res.send({ "greeting": "HELLO" });
});



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});