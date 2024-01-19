const mongoose=require('mongoose')
const requestSchema=mongoose.Schema;
const reqDetails=new requestSchema({
    ItemName:{
        type:String,required:true
    },
    ItemQuantity:{
        type:Number,required:true
    },
    Category:{
        type:String
    },
    CategoryID:{
        type:String,required:true
    },
    SiteID:{
        type:String,required:true
    },
    description:{
        type:String
    },
    vendorName:{
        type:String
    },
    payment:{
        tyepe:Number
    },
    file:{
        type:String
    },
    status:{
        type:String,
        enum:['Approved','Pending'],
        default:'Pending'
     },
    user:{
        type:requestSchema.Types.ObjectId,ref:"User"
    }
},{timestamps:true})

const requestdetails=mongoose.model("RequestList",reqDetails);
module.exports=requestdetails;