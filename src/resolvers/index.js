const addressLookup = require("./addressLookup");
const { users, carers, patients, availableCarersByDate } = require("./users");
const {
  allAppointments,
  appointmentsByUserId,
  appointmentsByDateAndUserId,
  createAppointment,
  deleteAppointment,
  updateAppointment,
  updateAppointmentReview,
} = require("./appointments");
const {
  notificationsByUserId,
  updateIsReadStatus,
  allNotifications,
} = require("./notifications");
const {
  carerInfo,
  patientInfo,
  updateUserInfo,
  updateCarerInfo,
  updatePatientInfo,
  updateApprovedStatus,
  updateCarerReviews,
} = require("./user");
const supervisor = require("./supervisor");
const patientDashboard = require("./patientDashboard");
const carerDashboard = require("./carerDashboard");
const {
  findPatientsByCarerGender,
  availablePatientsByCarerGenderAndDay,
} = require("./matchingPatient");
const { patientSignup, carerSignup } = require("./signup");
const login = require("./login");
const { createCarePlan } = require("./carePlan");

const resolvers = {
  Query: {
    addressLookup,
    users,
    carers,
    patients,
    availableCarersByDate,
    allAppointments,
    appointmentsByUserId,
    appointmentsByDateAndUserId,
    notificationsByUserId,
    allNotifications,
    carerInfo,
    patientInfo,
    supervisor,
    patientDashboard,
    carerDashboard,
    findPatientsByCarerGender,
    availablePatientsByCarerGenderAndDay,
  },
  Mutation: {
    patientSignup,
    carerSignup,
    login,
    updateUserInfo,
    updateCarerInfo,
    updatePatientInfo,
    updateApprovedStatus,
    updateCarerReviews,
    createAppointment,
    deleteAppointment,
    updateAppointment,
    updateAppointmentReview,
    updateIsReadStatus,
    createCarePlan,
  },
};

module.exports = resolvers;
