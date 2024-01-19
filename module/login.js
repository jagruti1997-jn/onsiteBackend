const mongoose=require('mongoose')
const loginSchema=mongoose.Schema;
const loginsch=new loginSchema({
    email:{
        type:String,required:true
    },
    password:{
        type:String,required:true
    },
},{timestamps:true})

const login=mongoose.model("login",loginsch);
module.exports=login;