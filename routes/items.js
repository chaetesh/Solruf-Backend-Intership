const express = require("express");
const fetchuser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");
const { findByIdAndUpdate } = require("../models/User");
const Item = require("../models/Item");
const router = express.Router();

// Will send response of all the items related to the specific user
// GET localhost:5000/api/items/fetchallitems (to get all the items)
router.get("/fetchallitems", fetchuser, async (req, res) => {
  const items = await Item.find({ user: req.user.id });
  res.json(items);
});

// POST localhost:5000/api/items/additem (to create new items)
router.post(
  "/additem",
//   MiddleWare used to get user details, to display items created by the user
  fetchuser,
  [
    body("name", "Enter a Valid name").isLength({ min: 3 }),
    body("description", "description atleast 5 Charecters").isLength({
      min: 5,
    }),
    body("price", "description atleast 5 Charecters").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    try {
      // if there are errors return bad request and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Creating new object from model
      const items = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        // we are getting userid from middleware
        user: req.user.id,
      });
      const savedItem = await items.save();

      res.json(savedItem);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);

// // PUT localhost:5000/api/items/updateitem (Update the items)
router.put("/updateitem/:id", fetchuser, async (req, res) => {
  try {
    const { name, description, price } = req.body;
    // create a newItem object
    const newItem = {};
    if (name) {
      newItem.name = name;
    }
    if (description) {
      newItem.description = description;
    }
    if (price) {
      newItem.price = price;
    }

    // find the item to be updated and update it
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(400).send("Not found");
    }

    // When a user is trying to change other users items
    if (item.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    // updating the items
    item = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: newItem },
      { new: true }
    );
    res.json({ item });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

// // DELETE localhost:5000/api/items/deleteitem (delete the items) (login required)
router.delete("/deleteitem/:id", fetchuser, async (req, res) => {
  try {
    // find the item to be deleted and delete it
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(400).send("Not found");
    }

    // When a user is trying to delete other users items
    if (item.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    // deleting the items
    item = await Item.findByIdAndDelete(req.params.id);
    res.json({ Success: "item has been deleted", item: item });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

module.exports = router;
