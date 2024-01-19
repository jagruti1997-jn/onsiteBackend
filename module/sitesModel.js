const mongoose=require('mongoose')
const sitesSchema=mongoose.Schema;
const siteDetails=new sitesSchema({
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
        type:sitesSchema.Types.ObjectId,ref:"User"
    }
},{timestamps:true})

const sitesDetails=mongoose.model("Sites",siteDetails);
module.exports=sitesDetails;