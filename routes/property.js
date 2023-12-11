const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const mongoose = require("mongoose");
const Property = mongoose.model("Property");
const requireLogin = require("../middlewears/requireLogin");

// Create a new property
router.post(
  "/properties",
  [
    body("ownerFirstName")
      .notEmpty()
      .withMessage("Owner first name is required"),
    body("ownerLastName").notEmpty().withMessage("Owner last name is required"),
    body("propertyTitle").notEmpty().withMessage("Property title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("imageUrl").notEmpty().withMessage("Image URL is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const property = new Property(req.body);
      await property.save();
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.get("/listAll", (req, res) => {
  Property.find().then((property) => {
    res
      .status(200)
      .json({ message: "All properties fetched.", property: property });
  })
  .catch((err) => {
    console.error("Error in listAll route: ", err.message ? err.message : err)
  })
});

module.exports = router;
