const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");

// app.use(express.static(path.join(__dirname, "..", "server")));
app.use(express.static(path.join(__dirname, "..", "build")));

// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, "..", "build", "index.html"));
// });

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../build/index.html"), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
