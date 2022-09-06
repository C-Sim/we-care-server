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
  phoneNumber: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
  },
  address: {
    type: Address,
  },
  accountType: {
    type: String,
    enum: ["supervisor", "carer", "patient"],
    required: true,
  },
  carerProfileId: {
    type: Schema.Types.ObjectId,
    ref: "Carer",
  },
  patientProfileId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },
  supervisorProfileId: {
    type: Schema.Types.ObjectId,
    ref: "Supervisor",
  },
  password: {
    type: String,
    required: true,
  },
  approvedStatus: {
    type: Boolean,
    default: false,
  },
};

const schema = new Schema(userSchema, { toJSON: { virtuals: true } });

schema.method("checkPassword", async function (password) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
});

schema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const password = await bcrypt.hash(this.password, 10);
    this.password = password;
  }

  next();
});

const User = model("User", schema);

module.exports = User;
