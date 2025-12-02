// set up server
const express= require('express')
const http = require("http");
const path = require("path")
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
require("dotenv").config()



const app = express();

const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true,               
};

app.use(cors(corsOptions));

connectDB()

app.use(express.json())
app.use(bodyParser.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json())
app.use(bodyParser.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Middleware for JSON, body-parser, and static file serving has been set up.");

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app



