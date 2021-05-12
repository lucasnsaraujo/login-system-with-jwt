const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.get("/", auth, (req, res) => {
  if (req.user.admin) {
    res.send("This data is only available if you're an admin");
  } else {
    res.status(401).send("Not Admin: Access Denied");
  }
});
router.get("/free", auth, (req, res) => {
  res.send("This data is only available if you're logged in");
});
module.exports = router;
