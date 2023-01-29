const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  currency: {
    type: String,
    default: 'USD'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  deleted : {
    type: Boolean,
    default: false
  }
}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    id: false,
    toJSON: {
        getters: true,
        virtuals: true
    },
    toObject: {
        getters: true,
        virtuals: true
    }
});


module.exports = mongoose.model("Product", ProductSchema);
