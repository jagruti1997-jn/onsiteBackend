const express = require('express')
const router = express.Router()
const { vendorValidationRules, validate } = require('../middleware/validation')
const vendorDetails = require('../module/vendorModel')

//fetch /read data
router.get('/', async (req, res) => {
  try {
    let { page = 1, size = 10, searchTerm } = req.query
    let pageNo=parseInt(page)
    const totalCount=await vendorDetails.countDocuments({ user: req.user});
    const lastpage=Math.ceil(totalCount/size)
    let query = searchTerm
      ? { Name: { $regex: new RegExp(searchTerm, 'i') } }
      : {}
    const limit = parseInt(size)
    const skip = (pageNo - 1) * size
    const data = await vendorDetails
      .find({ user: req.user, $or: [query] })
      .limit(limit)
      .skip(skip)

      let Next_page=null;
      if(pageNo<lastpage){
        Next_page=pageNo+1
      }
    res.status(200).json({
      Status_code: 200,
      Success: true,
      data: data,
      total:totalCount,
      item_per_page:size,
      current_page:pageNo,
      next_page:Next_page,
      last_page:lastpage
    })
  } catch (e) {
    res.status(500).json({
      Success: false,
      message: e.message,
    })
  }
})

//get by id

router.get('/:id', async (req, res) => {
  try{
  const data = await vendorDetails.findOne({ _id: req.params.id })
  const vendorData = {
    Name: data.Name,
    createdAt: data.createdAt,
  }
  res.status(200).json({
    Status_code: 200,
    Success: true,
    data: vendorData,
  })
} catch (e) {
  res.status(500).json({
    Success: false,
    message: e.message,
  })
}
})

//create data

router.post('/', vendorValidationRules(), validate, async (req, res) => {
  try {
    const data = await vendorDetails.create({
      Name: req.body.Name,
      PhoneNumber: req.body.PhoneNumber,
      Location: req.body.Location,
      description: req.body.description,
      user: req.user,
    })
    const venderID = data._id
    res.status(200).json({
      Status_code: 200,
      Success: true,
      data,
      venderID: venderID,
    })
  } catch (e) {
    res.status(500).json({
      Success: false,
      message: e.message,
    })
  }
})

//update data

router.put('/:id', async (req, res) => {
  try {
    const data = await vendorDetails.updateOne(
      { _id: req.params.id },
      {
        $set: {
          Name: req.body.Name,
          PhoneNumber: req.body.PhoneNumber,
          Location: req.body.Location,
          description: req.body.description,

          runValidators: true,
        },
      },
    )
    res.status(200).json({
      Status_code: 200,
      Success: true,
      
    })
  } catch (e) {
    res.status(500).json({
      Success: false,
      message: e.message,
    })
  }
})

//delete

router.delete('/:id', async (req, res) => {
  try {
    const data = await vendorDetails.deleteOne({ _id: req.params.id })
    res.status(200).json({
      Status_code: 200,
      Success: true,
      
    })
  } catch (e) {
    res.status(500).json({
      Success: false,
      message: e.message,
    })
  }
})

module.exports = router
