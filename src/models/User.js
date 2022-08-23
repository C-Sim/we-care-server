const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = {
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
    trim: true,
    unique: true,
    match: [/^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/],
  },
  accountType: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  approvedStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
};

const schema = new Schema(
  userSchema,
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
);

schema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const password = await bcrypt.hash(this.password, 10);
    this.password = password;
  }

  next();
});

const User = model("User", schema);

module.exports = User;
