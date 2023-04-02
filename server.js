import {readdirSync} from "fs";

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

require("dotenv").config();

//db
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERROR", err));

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//autoload routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

//server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port: ${port}`));
