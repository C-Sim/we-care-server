const { Schema } = require("mongoose");

const addressSchema = {
  formatted_address: [{ type: String }],
  thoroughfare: { type: String },
  building_name: { type: String },
  sub_building_name: { type: String },
  sub_building_number: { type: String },
  building_number: { type: String },
  line_1: { type: String },
  line_2: { type: String },
  line_3: { type: String },
  line_4: { type: String },
  locality: { type: String },
  town_or_city: { type: String },
  county: { type: String },
  district: { type: String },
  country: { type: String },
};

const schema = new Schema(addressSchema, {
  toJSON: {
    virtuals: true,
    getters: true,
  },
  _id: false,
});

schema.virtual("fullAddress").get(function () {
  return this.formatted_address.filter((each) => each).join(", ");
});

module.exports = schema;
