const addressLookup = require("./addressLookup");
const { users, carers, patients } = require("./users");
const {
  allAppointments,
  appointmentsByUserId,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} = require("./appointments");
const {
  notificationsByUserId,
  updateIsReadStatus,
} = require("./notifications");
const {
  carerInfo,
  patientInfo,
  updateCarerInfo,
  updatePatientInfo,
  updateApprovedStatus,
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
    notificationsByUserId,
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
    updateApprovedStatus,
    createAppointment,
    deleteAppointment,
    updateAppointment,
    updateIsReadStatus,
  },
};

module.exports = resolvers;
