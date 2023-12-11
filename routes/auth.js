const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const requireLogin = require("../middlewears/requireLogin");

router.get("/", (req, res) => {
  res.send("HELLO Property server!");
});

router.get("/protected", requireLogin, (req, res) => {
  res.send("Hello User");
});

router.post("/register", (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({
          error: "User with that email already exists. Please sign in.",
        });
      }

      bcrypt.hash(password, 16).then((hashedPassword) => {
        const newUser = new User({
          username: username,
          email: email,
          password: hashedPassword,
        });

        newUser
          .save()
          .then((user) => {
            res
              .status(200)
              .json({ message: "User Created Successfully!", data: user });
          })
          .catch((err) => {
            console.log(`Error saving user - ${err}`);
            res.status(500).json({ error: "Internal Server Error" });
          });
      });
    })
    .catch((err) => {
      console.log(`Error in email findOne - ${err}`);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// exclusive for web Client
router.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "Please enter email or password" });
  }

  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password 1" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        // doMatch is a boolean value
        if (doMatch) {
          // res.json({ message: "Successfully Signed In" });
          const { _id, name, email } = savedUser;
          const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET
          );
          res.json({ token: token, User: { _id, name, email } });
        } else {
          return res.status(422).json({ error: "Invalid email or password 2" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
