const mongoose = require("mongoose")
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: String,
    price: String,
    description: String,
    image: String,
    amount: Number
})

module.exports = mongoose.model("Products", productSchema)