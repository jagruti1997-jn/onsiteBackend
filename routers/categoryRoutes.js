const express=require('express')
const router=express.Router();
const {categoryValidationRules,validate}=require("../middleware/validation")
const categoryDetails=require("../module/categoryModel");



//fetch /read data
router.get("/",async (req,res)=>{
    let {page=1,size=10,searchTerm}=req.query;
       
    let query=searchTerm ? {Name:{$regex:new RegExp(searchTerm,'i')}}:{};
           const limit=parseInt(size);
    const skip=(page-1)*size;
    console.time("query")

    const data= await categoryDetails.find({user:req.user,$or:[query]}).limit(limit).skip(skip);
    const categoryId=data._id;
    res.status(200).json({
        Status_code:200,
        Success:true,
        page,
        size,
        data:data,
        categoryId:categoryId
    })


});


//get by id

router.get("/:id",async (req,res)=>{
    try{
        
        
    const data= await categoryDetails.findOne({_id:req.params.id});
    const categoryData={
        Name:data.Name,
        CategoryUnit:data.CategoryUnit
    }
    res.status(200).json({
        Status_code:200,
        Success:true,
        data:categoryData
    })
}catch(e){
    res.status(500).json({
        Success:false,
        message:e.message
    })
}


});

//create data

router.post("/",categoryValidationRules(),validate, async (req,res)=>{
    try{
       

        const data=await categoryDetails.create({Name:req.body.Name,
             CategoryUnit:req.body.CategoryUnit,
             user:req.user});
             const categoryId=data._id;
        res.status(200).json({
            Status_code:200,
            Success:true,
            data,
            categoryId
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
        const data=await categoryDetails.updateOne({_id:req.params.id},
            {$set:{
                vendorID:req.body.vendorID,
            

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
        const users=await categoryDetails.deleteOne({_id:req.params.id});
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