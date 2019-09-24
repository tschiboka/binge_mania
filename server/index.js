const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const homeRoute = require("./routes/home");
const genresRoute = require("./routes/genres");



app.use(express.json());
app.use("/home", homeRoute);
app.use("/api/genres", genresRoute);



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});