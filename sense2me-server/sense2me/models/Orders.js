const mongoose = require("mongoose")
const Schema = mongoose.Schema

const orderSchema = new Schema({
    id: Number,
    date: String,
    price: Number,
    items: Array,
    user: Number,
    dispatched: Boolean,
    orderCode: String,
    Address: String
  })

module.exports = mongoose.model("Orders", orderSchema)