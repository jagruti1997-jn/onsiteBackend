const express=require('express')
const bodyParser=require('body-parser')
const app=express()
require('dotenv').config();
app.use(bodyParser.json())
const port=process.env.PORT||8000;
const api=require('./index.js')



const mongoose=require('mongoose')
require('./database/db.js')



const loginRoutes=require("./routers/login.js")

app.get('/api/example', (req, res) => {
    // Correct: Use res.send() to send a response
    res.send('Hello, World! team ');
  });
  


//all routes calling
app.use("/api/v1",loginRoutes) 
app.use('/api/v1',api)



app.listen(port,()=>{
    console.log("server is running at 9000")
})