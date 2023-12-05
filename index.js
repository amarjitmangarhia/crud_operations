// import express framework
const express = require("express");

// import database file which is storing mongo db connection link
const database = require("./database")

//set up routes
const routes = require("./routes/routes")

// path modules to define more easily
const path = require("path");

const app = express();

// app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


app.set("views", path.join(__dirname, "./views"))

// setting view engine "pug"
app.set("view engine", "pug")

app.use(express.json());

//setting home route
app.use("/", routes);

// app will to 3000 port when you visit localhost:3000 app wil work
app.listen(3000, () => {
    console.log("Listening on Port 3000");
});

database.on("error", ()=> {
    console.log("Connection Error!")
})

database.once("connected", () => {
    console.log("Connection Successful!")
})

    