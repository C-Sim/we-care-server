const addressLookup = require("./addressLookup");
const { users, carers, patients } = require("./users");
const { allAppointments, appointmentsByUserId } = require("./appointments");
const userInfo = require("./user");
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
    userInfo,
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
  },
};

module.exports = resolvers;
