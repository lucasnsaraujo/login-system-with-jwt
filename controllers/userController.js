const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidate, loginValidate } = require("./validate");

module.exports = {
  register: async function (req, res) {
    const { error } = registerValidate(req.body);
    if (error) {
      return res.status(400).send(error.message);
    }
    const selectedUser = await User.findOne({ email: req.body.email });
    if (selectedUser) return res.status(400).send("User already exists");
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    // tentar salvar
    try {
      const savedUser = await user.save();
      res.send(savedUser);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  login: async function (req, res) {
    const { error } = loginValidate(req.body);
    if (error) {
      return res.status(400).send(error.message);
    }
    const selectedUser = await User.findOne({ email: req.body.email });
    if (!selectedUser)
      return res.status(400).send("Email or password incorrect");
    const passwordUserMatch = bcrypt.compareSync(
      req.body.password,
      selectedUser.password
    );
    if (!passwordUserMatch)
      return res.status(400).send("Email or password incorrect");
    const token = jwt.sign(
      { _id: selectedUser._id, admin: selectedUser.admin },
      process.env.TOKEN_SECRET
    );
    res.header("authorization-token", token);
    res.send("User logged");
  },
};
