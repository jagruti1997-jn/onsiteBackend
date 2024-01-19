const express=require("express")
const bodyParser=require('body-parser')
const auth=express()
// require('dotenv').config();
auth.use(bodyParser.json())
const login=require("../module/login")
const jwt = require("jsonwebtoken");
const secret = 'RESTAPI'
// const secret=process.env.SECRET_KEY;

//token generate



//authentication
const authorization= (req, res, next) => {
    console.log(req.headers.authorization)
    if (req.headers.authorization) {
        const token = req.headers.authorization
        

        jwt.verify(token, secret, async function (err, decoded) {
            if (err) {
                res.status(500).json({
                    status: "failed",
                    message: "not Authenticated"
                })
            }
            console.log(err, decoded)
            const user = await login.findOne({ _id: decoded.data });
            req.user = user._id;
            next();

        });

    } else {
        return res.status(500).json({
            status: "failed",
            message: "invalid token"
        })

    }
}




module.exports=authorization;