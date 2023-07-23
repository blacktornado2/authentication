const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    console.log(req.body);
    res.send("I am GET");
});

// app.use(session({}))
app.listen(3000);
