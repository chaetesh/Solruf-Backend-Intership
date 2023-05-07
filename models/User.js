// This is schema, With Mongoose everything is derived from a Schema.
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
// We are exporting the model, we are compiling Schema into model.
// A model is a class with which we construct documents.
module.exports = mongoose.model("user", UserSchema);
