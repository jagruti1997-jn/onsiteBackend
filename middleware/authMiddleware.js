const express = require('express')
const bodyParser = require('body-parser')
const auth = express()
// require('dotenv').config();
auth.use(bodyParser.json())
// const login = require('../module/login')
const userdetails = require('../module/userModel')
const Invalidtoken=require('../module/TokenModel')
const jwt = require('jsonwebtoken')
const secret = 'RESTAPI'
// const secret=process.env.SECRET_KEY;

//token generate

//authentication
const authorization = async (req, res, next) => {
  console.log(req.headers.authorization)
  if (req.headers.authorization) {
    const token = req.headers.authorization
    //invalidated Token
  const isTokenInvalidated=await Invalidtoken.exists({token});
   if(isTokenInvalidated){
    return res.status(401).json({
      message:'Unauthorized token has been invalidated'
    })
   }
    jwt.verify(token, secret, async function (err, decoded) {
      if (err) {
        res.status(500).json({
          status: 'failed',
          message: 'not Authenticated',
        })
      }
      
      if (decoded.data){
        const users = await userdetails.findOne({ _id: decoded.data })
       req.user = users._id
      }
      next()
    })
  } else {
    return res.status(500).json({
      status: 'failed',
      message: 'invalid token',
    })
  }
}

module.exports = authorization
