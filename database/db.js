const mongoose = require('mongoose')
require('dotenv').config()

// const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_DB_NAME } =
//   process.env
const { DB_HOST,DB_PORT,DB_NAME }=process.env

mongoose
  .connect(
    `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
  )
  .then(() => console.log('Database connected'))
  .catch((error) => {
    console.log(error)
  })
