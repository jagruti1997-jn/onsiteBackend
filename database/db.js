const mongoose=require("mongoose")
require('dotenv').config();

const { DB_HOST,DB_PORT,DB_NAME }=process.env


const connection=`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
// const connection="mongodb://localhost:27017/Test"
mongoose.connect(connection,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("database connected")).catch((error)=>{
    console.log(error)
})

