const mongoose = require("mongoose");
require('dotenv').config();

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_DB_NAME } = process.env;

mongoose.connect(`mongodb+srv://${encodeURIComponent(MONGO_USERNAME)}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => console.log("Database connected")).catch((error) => {
    console.log(error);
});
