const express=require("express"); 
const router=express.Router({mergeParams:true}); 
const Listing =require("../models/listing.js"); 
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js'); 
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");  
const listingController=require("../controllers/listings.js"); 
const multer=require("multer");  
const {storage}=require("../cloudConfig.js"); 
const upload=multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
}); 

// category-wise find and show 
router.get("/category/:catg",wrapAsync(listingController.renderCategory)); 

router.route("/")
    //index-route
    .get(wrapAsync(listingController.index))
    
    // create-route 
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));  
    
    // .post(upload.single("listing[image]"),(req,res)=>{
    //     res.send(req.file); 
    // }); 

// new and Create Route 
router.get('/new',isLoggedIn,listingController.renderNewForm);   

router.route("/:id")
    // Read/Show route 
    .get(wrapAsync(listingController.showListing))
    //update route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateListing))
    //delete route 
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));  
    
//edit route 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));  


// Search By City (route)
router.post("/search/city",wrapAsync(listingController.renderCityListings)); 

module.exports=router; 