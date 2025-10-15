// PACKAGES

const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// MIDDLEWARES

app.use(cors());
app.use(express.json());

// APP ROUTES

app.use("/", (req, res) => {
    res.send("Welcome to DevOps")
})

// PORT DETAILS

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT 8080!`);
});
