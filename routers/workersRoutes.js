const express=require('express')
const router=express.Router();
const {workersValidationRules,validate}=require("../middleware/validation")
const workerDetails=require("../module/workersModel");
const {parseISO}=require('date-fns')



//fetch /read data
router.get("/", async (req,res)=>{
    try{
        let {page=1,size=10,searchTerm}=req.query;
       

        //date query
        // const parsedQuery=parseISO(searchTerm);
        // const newQuery={
        //     $or:[
        //     {Name:{$regex:new RegExp(searchTerm,'i')}},parsedQuery ?{date:parsedQuery}:{}
        // ]}
        // let query=searchTerm ? newQuery:{};
       let query=searchTerm ? {Name:{$regex:new RegExp(searchTerm,'i')}}:{};
               const limit=parseInt(size);
        const skip=(page-1)*size;
        console.time("query")
    const data= await workerDetails.find({user:req.user,$or:[query]}
        ).limit(limit).skip(skip);
        console.timeEnd("query")
    res.status(200).json({
        Status_code:200,
        Success:true,
        page,
        size,
        data:data
    })}catch(e){
        res.status(500).json({
            Success:false,
            message:e.message
        })
    }

});


//get by id

router.get("/:id",async (req,res)=>{
    try{
    const data= await workerDetails.findOne({_id:req.params.id});
    res.status(200).json({
        Status_code:200,
        Success:true,
        data:data
    })
}catch(e){
    res.status(500).json({
        Success:false,
        message:e.message
    })
}

});

//create data

router.post("/",workersValidationRules(),validate, async (req,res)=>{
    try{
  
   const data=await workerDetails.create({Name:req.body.Name,date:req.body.date,
            status:req.body.status,             
             user:req.user});
             const workerID=data._id
        res.status(200).json({
            Status_code:200,
            Success:true,
            data,
            workerID:workerID
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
        const data=await workerDetails.updateOne({_id:req.params.id},
            {$set:{
                Name:req.body.Name, date:req.body.date,
                status:req.body.status,

            runValidators:true}});
        res.status(200).json({
            Status_code:200,
            Success:true,
            data
        })
    }catch(e){
        res.status(500).json({
            Status:false,
            message:e.message
        })
    }
})



//delete 

router.delete("/:id", async (req,res)=>{
    try{
        const data=await workerDetails.deleteOne({_id:req.params.id});
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