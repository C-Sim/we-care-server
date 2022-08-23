const { Schema, model } = require("mongoose");

const Address = require("./Address");

const addressLookupSchema = {
  postcode: {
    type: String,
    required: true,
    trim: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  addresses: [
    {
      type: Address,
    },
  ],
};

const options = {
  toJSON: {
    virtuals: true,
    getters: true,
  },
  id: false,
};

const schema = new Schema(addressLookupSchema, options);

schema.pre("save", async function (next) {
  this.postcode = this.postcode.toUpperCase().replace(" ", "");

  next();
});

const AddressLookup = model("AddressLookup", schema);

module.exports = AddressLookup;
