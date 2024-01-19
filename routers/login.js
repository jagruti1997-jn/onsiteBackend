const express=require('express')

const login=require("../module/login");
const {loginValidationRules,validate}=require("../middleware/validation")
const bcrypt=require('bcrypt')
var jwt=require('jsonwebtoken')
require('dotenv').config();
const secret=process.env.SECRET_KEY;
const router=express.Router();




//login api
router.post("/register",loginValidationRules(),validate,
async (req,res)=>{
     try{
    const {email,password} =req.body;

  const existingUser=await login.findOne({email});

  if(existingUser){
    return res.status(400).json({error:"Email is already in use"})
  }


   bcrypt.hash(password,10, async function(err,hash){
    if(err){
        res.status(500).json({
            Success:false,
            message:err.message
        })
    }
    const userlogin=await login.create({
        email,
        password:hash
    });
    const userEmail=userlogin.email
       res.status(200).json({
        Status_code:200,
        Success:true,
        message:"register successful",
        //userLogin
         userEmail
       }) 
   })
}catch(e){
    res.status(500).json({
        Success:false,
        message:e.message
    })
}

});



//signIn api
router.post("/login",loginValidationRules(),validate,
async (req,res)=>{
     try{
    

   const {email,password} =req.body;

const data=await login.findOne({email})
if(!data){
    res.status(400).json({
        Success:false,
        message:"user is not register"
    })
}

   bcrypt.compare(password,data.password, async function(err,result){
    if(err){
        res.status(500).json({
            Success:false,
            message:err.message
        })
    }
    if(result){
        const token=jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: data._id
          }, secret);


          //refresh token
          const expInDays=7;
          const expTime=expInDays*24*60*60;
          const refreshToken=jwt.sign({
            exp:Math.floor(Date.now()/1000)+expTime,
            data:data._id},secret)
        
          res.status(200).json({
            Status_code:200,
            Success:true,
            token,
            refreshToken
           }) 
    }
   
       
   })
}catch(e){
    res.status(500).json({
        Success:false,
        message:e.message
    })
}

});


//refresh token
router.post('/refresh',async (req,res)=>{
    const refreshToken=req.body.refreshToken
 
    if(!refreshToken){
        return res.status(401).json({
            error:'refresh token is required'
        })
    }
      
        jwt.verify(refreshToken,secret,async (err,decoded)=>{
        console.log(decoded)
            if(err){
                res.status(401).json({message:unauthorized})
            }else{
               
                const data=await login.findOne({_id:decoded.data})  
               const newToken=jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: data._id
              }, secret)
            res.json({
                status:'success',
                token:newToken,
            });

            }
        });
        


        

    
})

module.exports=router;
