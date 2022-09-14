const addressLookup = require("./addressLookup");
const { carers, patients, availableCarersByDate } = require("./users");
const {
  appointmentsById,
  appointmentsByUserId,
  appointmentNotesByUserId,
  appointmentsByDateAndUserId,
  appointmentsForNextWorkingDay,
  askForReallocation,
  createAppointment,
  createAppointments,
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
  userInfo,
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
    userInfo,
    carers,
    patients,
    availableCarersByDate,
    appointmentsById,
    appointmentsByUserId,
    appointmentNotesByUserId,
    appointmentsByDateAndUserId,
    appointmentsForNextWorkingDay,
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
    askForReallocation,
    updateCarerReviews,
    createAppointment,
    createAppointments,
    deleteAppointment,
    updateAppointment,
    updateAppointmentReview,
    updateIsReadStatus,
    createCarePlan,
  },
};

module.exports = resolvers;
