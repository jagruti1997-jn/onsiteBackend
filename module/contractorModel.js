const mongoose=require('mongoose')
const contractorSchema=mongoose.Schema;
const contractorDetails=new contractorSchema({
    Name:{
        type:String,unique:true,required:true
    },
    description:{
        type:String
    },
    Location:{
        type:String,required:true
    },

   user:{
        type:contractorSchema.Types.ObjectId,ref:"User"
    }
},{timestamps:true})

const contractorsDetails=mongoose.model("Contractor",contractorDetails);
module.exports=contractorsDetails;