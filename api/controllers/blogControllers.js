const Blog = require("./../models/Blog");

const s3 = require("../config/aws");


const newBlog = async(req,res)=>{
    try{
       let obj = {
           author:req.user._id,
           title:req.body.title,
           description:req.body.description,
           tags:req.body.tags,
           thumbnail:req.file.location
       };
       let blog = await Blog.create(obj);
       res.status(200).json({
           message:"Successfully added the blog",
           blogCreated:blog
       })
    }catch(e){
        res.status(400).json({
            error:e.toString()
        })
    }
}

const getBlogs = async (req,res)=>{
    try{
      let blogs = await Blog.find({author:req.user._id});
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 3;
      const start = limit*(page-1);
      const end = start+limit;
      let obj = {};
      if(start <=blogs.length-1 && start>=0 && blogs.length!=0){
          const bsliced = blogs.slice(start,end);
          obj["blogs"] = bsliced;
          if(start>0){
              obj["previous"]={
                  page:page-1,
                  limit:limit
              }
          }
          if(end<=blogs.length-1){
              obj["next"]={
                  page:page+1,
                  limit:limit
              }
          }
      }
      else if(blogs.length==0)
      { obj["message"]="0 BLOGS"}
      else{
          if(start>blogs.length-1) throw new Error("Invalid page number! Final Page number is: "+Math.ceil(blogs.length/Number(limit)));
          else if(start<0) throw new Error("Invalid Page number! Pages start from 1")
      }
      
      
      res.status(200).json(obj)
    }catch(e){
        res.status(400).json({
            error:e.toString()
        })
    }
}

const updateBlog = async (req,res)=>{
    try{
        let blog = await Blog.findById(req.params.id);
        if(!blog) throw new Error("No blog found!")
        if(blog.author.toString()!==req.user._id.toString()) throw new Error("This isn't your blog! You don't have the permission!")
        let updatedProps = Object.keys(req.body);
        for(let x of updatedProps){
            if(x!="image") blog[x] = req.body[x];
    }
       if(req.file.location){
            s3.deleteObject({
                Key:decodeURIComponent(blog.thumbnail.split('/').slice(-1)[0]),
                Bucket:"blogapi1408"
            },async(error,data)=>{
                if(error) throw new Error(error);
                else{
                    blog["thumbnail"]=req.file.location
                    await blog.save();

                    res.status(200).json({
                        message:"Successfully updated the blog",
                        updatedBlog:blog
                    })
                }
            })
    }

    }catch(e){
            res.status(400).json({
            error:e.toString()
        })
        
    }
}


const deleteBlog = async (req,res)=>{
    try{

        let blogs = await Blog.find({author:req.user._id});
        console.log(blogs)
    if(!blogs) throw new Error("No blog found!")
    for(let x in blogs){
        s3.deleteObject({
            Key:decodeURIComponent(blogs[x].thumbnail.split('/').slice(-1)[0]),
            Bucket:"blogapi1408"
        },async (error,data)=>{
            if(error) throw new Error(error);
        })
    }
    await Blog.deleteMany({author:req.user._id})
    res.status(200).json({
        message:"Successfully removed the blogs"
    })
}
   catch(e){ console.log(e)
        res.status(400).json({
        error:e.toString()
    })
}
    
}


const deleteAllBlogs = async (req,res)=>{
    try{
      let blog = await Blog.findById(req.params.id);
      if(!blog) throw new Error("No blog found!")
      if(blog.author.toString()!==req.user._id.toString()) throw new Error("This isn't your blog! You don't have the permission!")

      s3.deleteObject({
          Key:decodeURIComponent(blog.thumbnail.split('/').slice(-1)[0]),
          Bucket:"blogapi1408"
      },async (error,data)=>{
          if(error) throw new Error(error);
          else {
              console.log(data)
              await blog.remove();
              res.status(200).json({
              message:"Successfully removed the blog"
          })
          }
      })
    }catch(e){
        console.log(e)
      res.status(400).json({
      error:e.toString()
  })
  
  }
  
  }

module.exports= {
    newBlog,
    getBlogs,
    updateBlog,
    deleteAllBlogs,
    deleteBlog
}