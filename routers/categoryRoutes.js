const express = require('express')
const router = express.Router()
const {
  categoryValidationRules,
  validate,
} = require('../middleware/validation')
const categoryDetails = require('../module/categoryModel')

//fetch /read data
router.get('/', async (req, res) => {
  let { page = 1, size = 10, searchTerm } = req.query
  let pageNo=parseInt(page)
  const totalCount=await categoryDetails.countDocuments({ user: req.user});
  let query = searchTerm
    ? { Name: { $regex: new RegExp(searchTerm, 'i') } }
    : {}
  const limit = parseInt(size)
  const skip = (page - 1) * size
  console.time('query')

  const data = await categoryDetails
    .find({ user: req.user, $or: [query] })
    .limit(limit)
    .skip(skip)
    
    let Next_page=null;
      if(pageNo<lastpage){
        Next_page=pageNo+1
      }


  const categoryId = data._id
  res.status(200).json({
    Status_code: 200,
    Success: true,
    data: data,
    total:totalCount,
    item_per_page:size,
    current_page:pageNo,
    next_page:Next_page,
    last_page:lastpage,
    categoryId: categoryId,
  })
})

//get by id

router.get('/:id', async (req, res) => {
  try {
    const data = await categoryDetails.findOne({ _id: req.params.id })
    const categoryData = {
      Name: data.Name,
      CategoryUnit: data.CategoryUnit,
    }
    res.status(200).json({
      Status_code: 200,
      Success: true,
      data: categoryData,
    })
  } catch (e) {
    res.status(500).json({
      Success: false,
      message: e.message,
    })
  }
})

//create data

router.post('/', categoryValidationRules(), validate, async (req, res) => {
  try {
    const data = await categoryDetails.create({
      Name: req.body.Name,
      CategoryUnit: req.body.CategoryUnit,
      description:req.body.description,
      user: req.user,
    })
    const categoryId = data._id
    res.status(200).json({
      Status_code: 200,
      Success: true,
      data,
      categoryId,
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
    const data = await categoryDetails.updateOne(
      { _id: req.params.id },
      {
        $set: {
          vendorID: req.body.vendorID,

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
    const data = await categoryDetails.deleteOne({ _id: req.params.id })
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
