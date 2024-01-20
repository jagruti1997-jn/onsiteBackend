const express = require('express')
const router = express.Router()
const { userValidationRules, validate } = require('../middleware/validation')
const userDetails = require('../module/userModel')
const siteDetails = require('../module/sitesModel')
const bcrypt = require('bcrypt')

//fetch /read data
router.get('/', async (req, res) => {
  try {
    let { page = 1, size = 10, searchTerm } = req.query
    const searchRegex = new RegExp(searchTerm, 'i')
    const searchQuery = {
      $or: [
        { Name: { $regex: searchRegex } },

        // {Contact:{$eq:parseInt(searchTerm)}}
      ],
    }

    let query = searchTerm ? searchQuery : {}
    const limit = parseInt(size)
    const skip = (page - 1) * size

    const data = await userDetails
      .find({ user: req.user, $or: [query] })
      .limit(limit)
      .skip(skip)
    res.status(200).json({
      Status_code: 200,
      Success: true,
      page,
      size,
      data: data,
    })
  } catch (e) {
    res.status(500).json({
      Success: false,
      message: e.message,
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const data = await userDetails.findOne({ _id: req.params.id })
    if (data) {
      const site_data = await siteDetails.findOne({ _id: data.Site })

      const userData = {
        Name: data.Name,
        Role: data.Role,
        Email: data.Email,
        Site: site_data,
        createdAt: data.createdAt,
      }

      res.status(200).json({
        Status_code: 200,
        Success: true,
        data: userData,
      })
    } else {
      res.status(400).json({
        Status_code: 400,
        Success: true,
        message: 'User not found',
      })
    }
  } catch (error) {
    res.status(500).json({
      Success: false,
      message: error.message,
    })
  }
})
//create data
router.post('/', userValidationRules(), validate, async (req, res) => {
  const { Password, Name, Email, Contact, Role, Site } = req.body

  try {
    // Hash the password
    const hash = await bcrypt.hash(Password, 10)

    // Check if the email already exists
    const existingUser = await userDetails.findOne({ Email })

    if (existingUser) {
      // Email already exists, handle the error or take appropriate action
      return res.status(422).json({
        Status_code: 422,
        Success: false,
        message: 'Email already exists',
      })
    }

    // Email is unique, proceed with creating the new user
    const data = await userDetails.create({
      Name,
      Email,
      Password: hash,
      Contact,
      Role,
      Site,
      user: req.user,
    })

    const userRoleID = data._id

    // Handle the success, maybe send a response back
    return res.status(201).json({
      Status_code: 201,
      Success: true,
      message: 'User created successfully',
      data,
      userRoleID,
    })
  } catch (err) {
    // Handle errors
    console.error(err)
    return res.status(500).json({
      Status_code: 500,
      Success: false,
      message: err.message || 'Internal Server Error',
    })
  }
})

//update data
router.put('/:id', async (req, res) => {
  try {
    const data = await userDetails.updateOne(
      { _id: req.params.id },
      {
        $set: {
          Name: req.body.Name,
          LastName: req.body.LastName,
          Email: req.body.Email,
          Password: req.body.Password,
          Contact: req.body.Contact,
          Role: req.body.Role,
          Site: req.body.Site,

          runValidators: true,
        },
      },
    )
    res.status(200).json({
      Status_code: 200,
      message: 'User updated successfully',
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
    const users = await userDetails.deleteOne({ _id: req.params.id })
    res.status(200).json({
      Status_code: 200,
      message: 'User deleted successfully',
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
