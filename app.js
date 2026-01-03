if(process.env.NODE_ENV!="production"){
    require("dotenv").config(); 
}

const express=require('express'); 
const app=express(); 
const mongoose=require('mongoose');  
// const Listing =require("./models/listing.js"); 
const path=require('path');  
const methodOverride=require('method-override'); 
const ejsMate=require('ejs-mate'); 
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require('./utils/ExpressError.js'); 
// const {listingSchema,reviewSchema}=require("./schema.js");  
// const Review=require("./models/review.js");    
const ATLAS_URL=process.env.ATLASDB_URL; 


const session=require('express-session');  
const MongoStore=require('connect-mongo').default; 
const cookieParser=require('cookie-parser'); 
const flash=require("connect-flash"); 
const passport=require("passport"); 
const LocalStrategy=require("passport-local"); 
const User=require("./models/user.js");  

const listingRouter=require("./routes/listing.js"); 
const reviewRouter=require("./routes/review.js"); 
const userRouter=require("./routes/user.js"); 

main() 
.then(()=>{
    console.log("Connected to MongoDB")
})
.catch((err)=>{
    console.log(err); 
}); 

async function main(){
    await mongoose.connect(ATLAS_URL); 
}; 

const Store=MongoStore.create({
    mongoUrl: ATLAS_URL, 
    collectionName: "sessions",
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600, // in seconds
}); 

Store.on("error",(e)=>{
    console.log("ERROR IN MONGO SESSION",e); 
}); 

const sessionOptions={ 
    store: Store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000, // in ms; 
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}; 

app.use(cookieParser("secretcode")); // all request through cookiepaser middleware  
app.use(session(sessionOptions));  // for session id as a signed cookie to all requests 

app.use(flash()); // after cookie-parser and express-session  
app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

// root route
// app.get('/',(req,res)=>{
//     res.send("Root is working.")
// }); 

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");  
    res.locals.error=req.flash("error");  
    res.locals.currUser=req.user; 
    next(); 
});

app.set("view engine","ejs"); 
app.set("views",path.join(__dirname,"/views"));  
app.use(express.urlencoded( {extended :true })); 
app.use(express.json()); 
app.use(methodOverride("_method")); 
app.engine("ejs",ejsMate); 
app.use(express.static(path.join(__dirname,"/public"))); 

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email: "abc@gmail.com",
//         username: "sigma-stud",
//     }); 
//     let newUser=await User.register(fakeUser,"helloWorld"); 
//     res.send(newUser); 
// }); 

app.use("/listings",listingRouter); 
app.use("/listings/:id/reviews",reviewRouter); 
app.use("/",userRouter); 

// app.get('/testListing',async(req,res)=>{
//     let sampleListing= new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 2500,
//         location: "Calangute, Goa",
//         country: "India"
//     }); 
//     await sampleListing.save(); 
//     console.log("Sample was saved"); 
//     res.send("Testing Succesful"); 
// });


// page not found

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
}); 

// error handling middleware  
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong!"}=err; 
    // res.status(status).send(message); 
    res.status(status).render("listings/error.ejs",{message}); 
}); 

app.listen(8080,()=>{
    console.log("Server is listening on port 8080"); 
}); 
