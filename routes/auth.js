// This route is used for login and SignUp Purposes
const express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
// Importing user model
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchUser");
const JWT_SECRET = "secretPhrase";

// Create a user using POST "/api/auth/createuser".No login required
router.post(
  "/createuser",
  //   basic Express validation
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("name", "Enter a Valid name").isLength({ min: 3 }),
    body("password", "Password atleast 5 Charecters").isLength({ min: 5 }),
  ],
  //   We maked asynchronus function as we dont want to proceed further until current line executed completely
  async (req, res) => {
    let success = false;
    // if there are errors return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    // check whether the use with this email address exits?
    let user = await User.findOne({ success, email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "Email already Exists!!" });
    }
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);
    // Creating new user in mongoDb
    user = User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });

    const data = {
      user: {
        id: user.id,
      },
    };
    // singing the token
    const authtoken = jwt.sign(data, JWT_SECRET);
    console.log(authtoken);
    success = true;
    // sending authtoken as response
    res.json({ success, authtoken });
  }
);

// authenticate a user using POST "/api/auth/login".
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Wrong Credentials!" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({ success, error: "Wrong Credentials!" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      console.log(authtoken);
      success = true;

      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);

// GET loggen in user details using POST "/api/auth/getuser".
router.post(
  "/getuser",
  // this is middleware, first fetchuser will run and later this function, it do have same req and res
  fetchuser,
  async (req, res) => {
    try {
      const userID = req.user.id;
      const user = await User.findById(userID).select("-password");
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);

module.exports = router;
