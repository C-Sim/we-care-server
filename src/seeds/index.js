const connectToDatabase = require("../config/connection");

const { User, Carer, Patient, Supervisor, Appointment } = require("../models");
const { seedAppointments } = require("./appointments");
const { seedUsers } = require("./users");

const clearCollections = async () => {
  await User.deleteMany({});
  await Carer.deleteMany({});
  await Patient.deleteMany({});
  await Supervisor.deleteMany({});
  await Appointment.deleteMany({});
};

const init = async () => {
  try {
    await connectToDatabase();

    // clear all collections
    await clearCollections();

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
