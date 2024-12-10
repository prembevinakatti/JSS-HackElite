const mongoose=require("mongoose")
const categorySchema=new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    subcategories:[{
        type:String
    }]
},{timestamps:true})
const categoryModle= mongoose.model("catogory",categorySchema);
module.exports=categoryModle;