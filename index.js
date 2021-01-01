const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(helmet());
app.use(morgan("tiny"));

