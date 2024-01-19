const mongoose=require('mongoose')
const usersSchema=mongoose.Schema;
const userDetails=new usersSchema({
    FirstName:{
        type:String,required:true
    },
    
    Contact:{
        type:Number,required:true
    },
    Email:{
        type:String,required:true
    },
    Password:{
        type:String,required:true
    },
    NewPassword:{
        type:String 
    },
    ConformPassword:{
        type:String
    },
    Role:{
        type:String,
        enum:['Supervisor','Accountant'],required:true
    },
    Site:{
        type:String,required:true
    },
    
  
    user:{
        type:usersSchema.Types.ObjectId,ref:"User"
    }
},{timestamps:true})

const userdetails=mongoose.model("UserCreate",userDetails);
module.exports=userdetails;