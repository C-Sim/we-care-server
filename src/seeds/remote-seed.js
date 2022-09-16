require("dotenv").config();
const mongoose = require("mongoose");
const {
  User,
  Carer,
  Patient,
  Supervisor,
  Appointment,
  AddressLookup,
  Notification,
} = require("../models");
const { seedAppointments } = require("./appointments");
const { seedUsers } = require("./users");
const { seedAddressLookup } = require("./addressLookup");

const clearCollections = async () => {
  await User.deleteMany({});
  await Carer.deleteMany({});
  await Patient.deleteMany({});
  await Supervisor.deleteMany({});
  await Appointment.deleteMany({});
  await AddressLookup.deleteMany({});
  await Notification.deleteMany({});
};

const init = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`[INFO]: Successfully connected to database`);

    // clear all collections
    await clearCollections();

    //seed address lookup
    await seedAddressLookup();

    // seed users - and supervisors, carers, patients
    await seedUsers();

    // seed appointments - and associated reviews and notifications
    await seedAppointments();
  } catch (error) {
    console.log(`[ERROR]: Failed to seed DB | ${error.message}`);
  }

  process.exit(0);
};

init();
