const express=require('express')
const router=express.Router();
const {userValidationRules,validate}=require("../middleware/validation")
const userDetails=require("../module/userModel");
const bcrypt=require('bcrypt')

//fetch /read data
router.get("/",async (req,res)=>{
    try{
        let {page=1,size=10,searchTerm}=req.query;
         const searchRegex=new RegExp(searchTerm,'i')
   const searchQuery={
    $or:[
        {Name:{$regex:searchRegex}},
       
        // {Contact:{$eq:parseInt(searchTerm)}}
    ]
   };

          
        let query=searchTerm ? searchQuery:{};
               const limit=parseInt(size);
        const skip=(page-1)*size;

    const data= await userDetails.find({user:req.user,$or:[query]}).limit(limit).skip(skip);
    res.status(200).json({
        Status_code:200,
        Success:true,
        page,
        size,
        data:data
    })
}catch(e){
    res.status(500).json({
        Success:false,
        message:e.message
    })
}

});

router.get("/:id",async (req,res)=>{
    
    const data= await userDetails.findOne({_id:req.params.id});

    const site_data = await siteDetails.findOne({_id:data.Site});

    const userData={
        Name:data.Name,
        Role:data.Role,
        Email:data.Email,
        Site:site_data,
        createdAt:data.createdAt,
        
    }
    res.status(200).json({
        Status_code:200,
        Success:true,
        data:userData
    })

});
//create data
router.post("/",userValidationRules(),validate, async (req,res)=>{
    try{
        console.log("-------- ")
        const {Password} =req.body;
        bcrypt.hash(Password,10, async function(err,hash){
            if(err){
                res.status(500).json({
                    Success:false,
                    message:err.message
                })
            }

            // First, check if the email already exists
            const existingUser = await userDetails.findOne({ Email: req.body.Email });
            console.log("existingUser ",existingUser)
            if (existingUser) {
                // Email already exists, handle the error or take appropriate action
                return res.status(422).json({ 
                        Status_code:422,
                        Success:true, 
                        message: 'Email already exists' });
            } else {
                // Email is unique, proceed with creating the new user
                const data = await userDetails.create({
                    FirstName: req.body.FirstName,
                    Email: req.body.Email,
                    Password: hash,
                    Contact: req.body.Contact,
                    Role: req.body.Role,
                    Site: req.body.Site,
                    user: req.user
                });
                const userRoleID=data._id
                // Handle the success, maybe send a response back
                return res.status(201).json({ Status_code:200,
                                              Success:true, 
                                              message: 'User created successfully',
                                                data,
                                                userRoleID:userRoleID });
            }
    })
    }catch(e){
        res.status(500).json({
            Success:false,
            message:e.message
        })
    }
})


//update data

router.put("/:id", async (req,res)=>{
    try{
        const data=await userDetails.updateOne({_id:req.params.id},
            {$set:{
                Name:req.body.Name,
            LastName:req.body.LastName,Email:req.body.Email,Password:req.body.Password,
            Contact:req.body.Contact,Role:req.body.Role,Site:req.body.Site,

            runValidators:true}});
        res.status(200).json({
            Status_code:200,
            Success:true,
            data
        })
    }catch(e){
        res.status(500).json({
            Success:false,
            message:e.message
        })
    }
})



//delete 



router.delete("/:id", async (req,res)=>{
    try{
        const users=await userDetails.deleteOne({_id:req.params.id});
        res.status(200).json({
            Status_code:200,
            Success:true,
            users
        })
    }catch(e){
        res.status(500).json({
           Success:false,
            message:e.message
        })
    }
})


module.exports=router;