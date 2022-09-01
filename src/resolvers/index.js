const addressLookup = require("./addressLookup");
const { users, carers, patients } = require("./users");
const {
  allAppointments,
  appointmentsByUserId,
  createAppointment,
} = require("./appointments");
const {
  receivedNotificationsByUserId,
  sentNotificationsByUserId,
} = require("./notifications");
const {
  carerInfo,
  patientInfo,
  updateCarerInfo,
  updatePatientInfo,
} = require("./user");
const supervisor = require("./supervisor");
const patientDashboard = require("./patientDashboard");
const carerDashboard = require("./carerDashboard");
const {
  findPatientsByCarerGender,
  findPatientsByCarerGenderAndDay,
} = require("./matchingPatient");
const { signup, patientSetup } = require("./signup");
const login = require("./login");

const resolvers = {
  Query: {
    addressLookup,
    users,
    carers,
    patients,
    allAppointments,
    appointmentsByUserId,
    receivedNotificationsByUserId,
    sentNotificationsByUserId,
    carerInfo,
    patientInfo,
    supervisor,
    patientDashboard,
    carerDashboard,
    findPatientsByCarerGender,
    findPatientsByCarerGenderAndDay,
  },
  Mutation: {
    signup,
    patientSetup,
    login,
    updateCarerInfo,
    updatePatientInfo,
    createAppointment,
  },
};

module.exports = resolvers;
