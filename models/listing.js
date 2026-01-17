const mongoose=require('mongoose');  
const Schema=mongoose.Schema; 
const Review=require('./review.js'); 

let listingSchema = new Schema({
    title: {
        type:String, 
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String, 
        filename: String,
    },
    price:{
        type: Number,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type:{
            type: String,
            enum: ['Point'],
            // required: true,
        },
        coordinates:{
            type: [Number],
            required: true,
        }
    },
    category: {
        type: String,
        enum: ["trending","beach","mountain","city","castle","pool","camp","farm","arctic","room"],
    }, 
    city :{
        type: String, 
        required: true,
        trim: true,
        lowercase: true,
    }
}); 

// all reviews of deleting listing gets deleted 
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id :{$in: listing.reviews}}); 
    }
}); 

const Listing = mongoose.model("Listing",listingSchema)
module.exports=Listing;  