const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    tags:[
        {
            type:String,
            trim:true,
            required:true
        }
    ],
    thumbnail:{
        type:String,
        trim:true,
        required:true
    }

},{
    timestamps:true
})

const Blog = mongoose.model("Blog",blogSchema);

module.exports = Blog;