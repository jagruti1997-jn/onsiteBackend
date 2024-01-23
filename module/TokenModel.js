const mongoose = require('mongoose')
const tokenSchema = mongoose.Schema
const tokensch = new tokenSchema(
  {
    token: {
      type: String,
      
    }
}
)

const Invalidtoken = mongoose.model('token', tokensch)
module.exports = Invalidtoken