const express=require("express"); 
const router=express.Router({mergeParams:true}); 
const Listing =require("../models/listing.js"); 
const Review =require("../models/review.js"); 
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js'); 
const {isLoggedIn,isAuthor,validateReview}=require("../middleware.js");  
const reviewController=require("../controllers/reviews.js"); 

// review post route 
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview)); 

// review Delete route 
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));  

router.get("/:reviewId/",(req,res)=>{
    const {id}=req.params; 
    res.redirect(`/listings/${id}`); 
}); 

module.exports=router; 