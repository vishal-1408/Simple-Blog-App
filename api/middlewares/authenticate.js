const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

module.exports = async (req,res,next)=>{
    try{
        const token = req.header("Authorization").replace("Bearer ","");
        const userId = jwt.verify(token,process.env.SECRET)
        const user = await User.findById(userId.id)
        if(!user) throw new Error("Token is Invalid! Not associated with any user");
        const check = user.tokens.findIndex(t=>t.token==token);
        if(check===-1) throw new Error("Token is Invalid");
        req.user = user;
        req.token = token;
        next();
    }catch(e){
        console.log(e)
        res.status(400).json({
            error:e.toString()
        })
    }
    }