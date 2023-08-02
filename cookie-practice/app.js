const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/cookie", (req, res) => {
    console.log(req.cookies);
    // res.setHeader("Set-Cookie", "Authorization=bearer jwt");
    // res.cookie("isLoggedIn", true)
    return res.json({ message: "Success" });
});

app.listen(3000, () => console.log(`Server is listening on PORT 3000`));
