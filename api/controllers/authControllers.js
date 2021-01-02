const register = async (req,res)=>{
    try{
        const user = await User.create({...req.body,tokens:[]});
        const token = jwt.sign({
            id:user._id
        },process.env.SECRET);

        user.tokens.push({token})
        await user.save();

        res.status(200).json({
          message:"successfully registered",
          token
      })
    }catch(e){
          console.log(e)
        res.status(400).json({
            error:e.toString()
        })
    }
}

const login = async(req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username});
        if(!user) {res.status(404);throw new Error("User with the given username doesn't exist")}
        const compare = await bcrypt.compare(req.body.password,user.password);
        if(compare===false) {res.status(401);throw new Error("Passwords doesn't match")}
        const token = jwt.sign({
            id:user._id
        },process.env.SECRET);

        user.tokens.push({token})
        await user.save();
        res.status(200).json({
            message:"successfully logged In",
            token
        })
    }catch(e){
          console.log(e)
        if(res.statusCode){
            res.json({
                error:e.toString()
            })
        }else{
            res.status(400).json({
                error:e.toString()
            })
        }
    }

}




const logout = async (req,res)=>{
    try{
        console.log(req.user)
        req.user.tokens = req.user.tokens.filter(t=>t!==req.token);
         await req.user.save()
        res.status(200).json({
            message:'successfully logged out'
        })
    }
    catch(e){
          console.log(e)
        res.status(400).json({
            error:e.toString()
        })
    }
}


const logoutAll = async (req,res)=>{
    try{
        req.user.tokens = [];
        await req.user.save()
        res.status(200).json({
            message:'successfully logged out'
        })
    }
    catch(e){
          console.log(e)
        res.status(400).json({
            error:e.toString()
        })
    }
}


module.exports = {
    register,
    login,
    logout,
    logoutAll
}