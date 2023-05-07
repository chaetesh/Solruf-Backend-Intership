const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://chaetesh:aetesh1234@cluster0.rygkltt.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongod Succesfully");
  });
};

// This module will get exported
module.exports = connectToMongo;
