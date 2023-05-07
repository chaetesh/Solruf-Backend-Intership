// This is schema, With Mongoose everything is derived from a Schema.
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemsSchema = new Schema({
  // Specifying other mongoose model type
  user: {
    type: mongoose.Schema.Types.ObjectId,
    // user model type, linking user model to notes model
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
// We are exporting the model, we are compiling Schema into model.
// A model is a class with which we construct documents.
module.exports = mongoose.model("items", ItemsSchema);
