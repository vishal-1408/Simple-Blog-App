const express = require("express");
const expressLimiter = require("express-rate-limit");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const authRoutes = require("./api/routes/authRoutes");
const blogRoutes = require("./api/routes/blogRoutes");
require("dotenv").config();



mongoose.connect(process.env.DBURL,{useCreateIndex:true,useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>{
    console.log("database connected!!")
})
.catch(e=>{
    console.log("error: "+e)
})


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

if(!process.env.TESTING)app.use(new expressLimiter({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message:
      "Too many requests received from this Ip address,please wait for a while",
}))
app.use(helmet());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });
if(!process.env.TESTING) app.use(morgan("tiny"))



//ROUTES

app.use("/user",authRoutes);
app.use("/blogs",blogRoutes)





const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("SERVER RUNNING ON PORT "+PORT);
})

