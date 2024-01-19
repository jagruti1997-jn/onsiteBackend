const express=require('express')
const router=express.Router();
const authorization=require("./middleware/authMiddleware.js")



// const loginRoutes=require("./routers/login.js")
const categoryRoutes=require("./routers/categoryRoutes.js")
const vendorRoutes=require("./routers/vendorRoutes.js")
const sitesRoutes=require("./routers/sitesRoutes.js")
const workerRoutes=require("./routers/workersRoutes.js")
const usersRoutes=require("./routers/userRoutes.js")
const requestRoutes1=require("./routers/requestRoutes1.js")
const contractorRoutes=require("./routers/contractorRoutes.js")

//middleware/auth
router.use("/",authorization)

// router.use("/login",loginRoutes) 
router.use("/category",categoryRoutes)
router.use("/vendor",vendorRoutes)
router.use("/sites",sitesRoutes)
router.use("/worker",workerRoutes)
router.use("/users",usersRoutes)
router.use("/request",requestRoutes1)
router.use("/contractor",contractorRoutes)

module.exports=router