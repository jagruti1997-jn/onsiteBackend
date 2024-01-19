const express=require('express')
const router=express.Router();
const {siteValidationRules,validate, contractorValidationRules}=require("../middleware/validation")
const contractorDetails=require("../module/contractorModel");


//validation






//fetch /read data
router.get("/",async (req,res)=>{
    try{
    let {page=1,size=10,searchTerm}=req.query;
       
    let query=searchTerm ? {Name:{$regex:new RegExp(searchTerm,'i')}}:{};
           const limit=parseInt(size);
    const skip=(page-1)*size;
    const data= await contractorDetails.find({user:req.user,$or:[query]}).limit(limit).skip(skip);
    
    res.status(200).json({
        Status_code:200,
        Success:true,
        page,
        size,
        data
       
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
    
    const data= await contractorDetails.findOne({_id:req.params.id});
    const contractorData={
        Name:data.Name
    }
    res.status(200).json({
        Status_code:200,
        Success:true,
        data:contractorData
    })

});

//create data

router.post("/",contractorValidationRules(),validate, async (req,res)=>{
    try{
       
         const data=await contractorDetails.create({Name:req.body.Name,
             description:req.body.description,
             Location:req.body.Location,
             user:req.user});
             const contractorId=data._id
        res.status(200).json({
            Status_code:200,
            Success:true,
            data,
            contractorId:contractorId
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
        const data=await contractorDetails.updateOne({_id:req.params.id},
            {$set:{
                Name:req.body.Name,
                Location:req.body.Location,
            description:req.body.description,
            
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
        const data=await contractorDetails.deleteOne({_id:req.params.id});
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


module.exports=router;