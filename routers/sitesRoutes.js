const express=require('express')
const router=express.Router();
const {siteValidationRules,validate}=require("../middleware/validation")
const siteDetails=require("../module/sitesModel");


//validation






//fetch /read data
router.get("/",async (req,res)=>{
    try{
    let {page=1,size=10,searchTerm}=req.query;
       
    let query=searchTerm ? {Name:{$regex:new RegExp(searchTerm,'i')}}:{};
           const limit=parseInt(size);
    const skip=(page-1)*size;
    const data= await siteDetails.find({user:req.user,$or:[query]}).limit(limit).skip(skip);
    
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
    
    const data= await siteDetails.findOne({_id:req.params.id});
    const siteData={
       Name:data.Name,
       createdAt:data.createdAt 
    }
    res.status(200).json({
        Status_code:200,
        Success:true,
        data:siteData
    })

});

//create data

router.post("/",siteValidationRules(),validate, async (req,res)=>{
    try{
       
         const data=await siteDetails.create({Name:req.body.Name, description:req.body.description,Location:req.body.Location,
             user:req.user});
             const siteId=data._id
        res.status(200).json({
            Status_code:200,
            Success:true,
            data,
            siteId:siteId
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
        const data=await siteDetails.updateOne({_id:req.params.id},
            {$set:{
                Name:req.body.Name,
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
        const data=await siteDetails.deleteOne({_id:req.params.id});
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