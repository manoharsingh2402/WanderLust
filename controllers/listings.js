const Listing=require("../models/listing.js"); 
const {listingSchema}=require("../schema.js"); 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const datas=await Listing.find({}); 
    return res.render("./listings/index.ejs",{datas}); 
}; 

module.exports.renderNewForm=(req,res)=>{
    return res.render("listings/new.ejs"); 
}; 

module.exports.createListing = async (req, res) => {

    // 1️⃣ Geocode
    const response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send();

    if (!response.body.features.length) {
        req.flash("error", "Invalid location");
        return res.redirect("/listings/new");
    }

    const geometry = response.body.features[0].geometry;

    // 2️⃣ Image check
    if (!req.file) {
        req.flash("error", "Image upload failed");
        return res.redirect("/listings/new");
    }

    // 3️⃣ Joi validation (with category)
    const { error } = listingSchema.validate(req.body,{allowUnknown:true});
    if (error) {
        throw new ExpressError(400, error);
    }

    // 4️⃣ Create listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
        url: req.file.secure_url,
        filename: req.file.public_id
    };

    // ✅ Correct GeoJSON
    newListing.geometry = geometry;

    await newListing.save();

    req.flash("success", "New Listing is Added");
    return res.redirect("/listings");
};

module.exports.showListing=async(req,res)=>{
    const {id}=req.params; 
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); 
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist!"); 
        return res.redirect("/listings"); 
    }else{
        return res.render("./listings/show.ejs",{listing}); 
    }
    
}

module.exports.renderEditForm=async(req,res)=>{ 
    const {id}=req.params; 
    const listing=await Listing.findById(id);  
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist!"); 
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url; 
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250"); 
    console.log(originalImageUrl);
    return res.render("listings/edit.ejs",{listing,originalImageUrl}); 
}; 

module.exports.updateListing=async(req,res)=>{   
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing"); 
    }
    
    const updatedListing=req.body.listing; 
    const {id}=req.params; 
    const listing=await Listing.findByIdAndUpdate(id,updatedListing);  
    if (typeof req.file !="undefined"){
        const url= req.file.url; 
        const filename=req.file.original_filename;  
        listing.image={url,filename}; 
        await listing.save(); 
    }
    
    // console.log(updatedListing); 
    req.flash("success","Listing is updated"); 
    return res.redirect(`/listings/${id}`);  
}; 

module.exports.deleteListing=async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);  
    req.flash("success","Listing is deleted"); 
    return res.redirect("/listings"); 
};  

module.exports.renderCategory=async(req,res)=>{
    const {catg}=req.params; 
    const datas=await Listing.find({category:catg});  
    if(datas.length===0){
        req.flash("error","No listings found under this category"); 
        return res.redirect("/listings"); 
    }
    return res.render("./listings/index.ejs",{datas});
}