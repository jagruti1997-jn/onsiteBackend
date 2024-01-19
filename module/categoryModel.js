const mongoose=require('mongoose')
const categorySchema=mongoose.Schema;
const catDetails=new categorySchema({
    Name:{
        type:String,unique:true,required:true
    },
   vendorID:{

        type:String,require:true
    },
     CategoryUnit:{
        type:String,required:true
     },
   user:{
        type:categorySchema.Types.ObjectId,ref:"User"
    }
},{timestamps:true})

const categoryDetails=mongoose.model("Category",catDetails);
module.exports=categoryDetails;