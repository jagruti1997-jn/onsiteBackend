const express=require('express')
const router=express.Router();
const {userValidationRules,validate}=require("../middleware/validation")
const userDetails=require("../module/userModel");
const bcrypt=require('bcrypt')

//validate input






//fetch /read data
router.get("/",async (req,res)=>{
    try{
        let {page=1,size=10,searchTerm}=req.query;
         const searchRegex=new RegExp(searchTerm,'i')
   const searchQuery={
    $or:[
        {FirstName:{$regex:searchRegex}},
       
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



//get by id

router.get("/:id",async (req,res)=>{
    
    const data= await userDetails.findOne({_id:req.params.id});
    const userData={
        FirstName:data.FirstName,
        Role:data.Role,
        createdAt:data.createdAt
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

        const {Password} =req.body;
        bcrypt.hash(Password,10, async function(err,hash){
            if(err){
                res.status(500).json({
                    Success:false,
                    message:err.message
                })
            }

   const data=await userDetails.create({FirstName:req.body.FirstName
            ,Email:req.body.Email,Password:hash,
            Contact:req.body.Contact,Role:req.body.Role,Site:req.body.Site,
            user:req.user});
            const userRoleID=data._id
        res.status(200).json({
            Status_code:200,
            Success:true,
            data,
            userRoleID:userRoleID

        })
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
                FirstName:req.body.FirstName,
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