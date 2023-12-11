const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  ownerFirstName: { type: String, required: true },
  ownerLastName: { type: String, required: true },
  propertyTitle: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
