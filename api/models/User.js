const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true,
    trim:true,
   },
   username:{
       type:String,
       required:true,
       trim:true,
       unique:true
   },
   password:{
       type:String,
       required:true,
       trim:true,
       min:7
   },
   bio:{
       type:String
   },
   tokens:[
      {
        token:{
            type:String,
            required:true,
            trim:true
           }
      }
   ]
},{
    timestamps:true
})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next();
})



const User = mongoose.model("User",userSchema);



module.exports = User;