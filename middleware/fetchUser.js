var jwt = require("jsonwebtoken");
const JWT_SECRET = "secretPhrase";

const fetchuser = (req, res, next) => {
  // Get the user from jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate the token" });
  }
  try {
    // verifying the token, decryting will done using our secret_code
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate the token" });
  }
};

module.exports = fetchuser;
