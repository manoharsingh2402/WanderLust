const mongoose=require('mongoose');  
const Listing =require("../models/listing.js");  
let initData=require('./data.js'); 

main() 
.then(()=>{
    console.log("Connected to MongoDB")
})
.catch((err)=>{
    console.log(err); 
}); 

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust'); 
} 

const initDB= async ()=>{
    await Listing.deleteMany({});  // removing all existing datas  
    initData.data=initData.data.map((obj)=>({
        ...obj,owner:'6950e88e8714789715351c80',
    }));  
    await Listing.insertMany(initData.data); // inserting all sample datas once   
    console.log("Data was initialized."); 
}

initDB(); 