const { default: mongoose } = require("mongoose");
const { Schema, Model } = require("mongoose");

const CategorySchema = new Schema({
education:Boolean,
electronic:Boolean,
fashion:Boolean,
furniture:Boolean,
Property:Boolean,
})
module.exports = Model("category", CategorySchema);