const User=require("../models/user.js"); 

module.exports.renderSignUpForm=(req,res)=>{
    res.render("./users/signup.ejs"); 
}; 

module.exports.signUp=async(req,res)=>{
    try{
        const {username,email,password}=req.body; 
        const newUser=new User({username,email,password}); 
        const registeredUser=await User.register(newUser,password);  

        // console.log(registeredUser);  
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err); 
            }
            req.flash("success","welcome to WanderLust!"); 
            res.redirect("/listings"); 
        }); 
        
    }
    catch(err){
        req.flash("error",err.message); 
        res.redirect("/signup"); 
    }
}; 

module.exports.renderLoginForm=(req,res)=>{
    res.render("./users/login.ejs")
}; 

module.exports.login=(req,res)=>{
    req.flash("success","welcome back to WanderLust!");  
    const redirectUrl=res.locals.redirectUrl || "/listings"; 
    res.redirect(redirectUrl); 
}; 

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err); 
        }
        req.flash("success","Logged out successfully"); 
        res.redirect("/listings"); 
    }); 
}; 