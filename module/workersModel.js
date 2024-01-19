const mongoose=require('mongoose')
const workersSchema=mongoose.Schema;
const workerDetails=new workersSchema({
    Name:{
        type:String,required:true
    },
    date:{
        type:String,required:true
    },
   
     status:{
        type:String,
        enum:['Skilled','Unskilled'],
        default:'Skilled'
     },
   user:{
        type:workersSchema.Types.ObjectId,ref:"User"
    }
},{timestamps:true})

const workersDetails=mongoose.model("Workers",workerDetails);
module.exports=workersDetails;