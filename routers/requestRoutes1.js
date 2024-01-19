const express=require('express')
const router=express.Router();
const {requestValidationRules,fileValidationRules,validate}=require("../middleware/validation")
const reqDetails=require("../module/requestModel1");
const multer=require('multer')


//validateInput



//MULTER TO UPLOAD FILE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
     filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  const upload=multer({storage:storage});

//fetch /read data
router.get("/",upload.single('file'),async (req,res)=>{
    try{
        let {page=1,size=10,searchTerm}=req.query;
       
    let query=searchTerm ? {ItemName:{$regex:new RegExp(searchTerm,'i')}}:{};
           const limit=parseInt(size);
    const skip=(page-1)*size;
    const data= await reqDetails.find({user:req.user,$or:[query]}).limit(limit).skip(skip);
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


//get by id

router.get("/:id",upload.single('file'),async (req,res)=>{
    
    const data= await reqDetails.findOne({_id:req.params.id});
    res.status(200).json({
        Status_code:200,
        Success:true,
        data:data
    })

});

//create data

router.post("/",requestValidationRules(),validate, async (req,res)=>{
    try{
          const data=await reqDetails.create({ItemQuantity:req.body.ItemQuantity,
            ItemName:req.body.ItemName,CategoryID:req.body.CategoryID,SiteID:req.body.SiteID,description:req.body.siteID,
         user:req.user});

         const requestID=data._id
        res.status(200).json({
            Status_code:200,
            Success:true,
            data,
            requestID:requestID
        })
    }catch(e){
        res.status(500).json({
            Success:false,
            message:e.message
        })
    }
})


//update data
// upload.single('file')

router.put("/:id",upload.single('file'),fileValidationRules(),validate, async (req,res)=>{
    try{
        const FILE=req.body.filename
        console.log(FILE)

        const data=await reqDetails.updateOne({_id:req.params.id},
            {$set:{
                
              file:FILE,
            vendorName:req.body.vendorName,
            status:req.body.status,


            runValidators:true}});
           const requestID=data._id

        res.status(200).json({
            Status_code:200,
            Success:true,
            data,
            requesID:requestID
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
        const data=await reqDetails.deleteOne({_id:req.params.id});
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