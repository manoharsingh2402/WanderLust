const mongoose=require("mongoose"); 
const {Schema}=mongoose; // destructuring   
const passportLocalMongoose=require("passport-local-mongoose");  // implements username,password,hashing,salting 

const userSchema=new Schema({
    email:{
        type: String, 
        required: true,
    },
});  

userSchema.plugin(passportLocalMongoose.default);  
module.exports= mongoose.model("User",userSchema); 