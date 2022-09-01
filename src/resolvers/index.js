const addressLookup = require("./addressLookup");
const { users, carers, patients } = require("./users");
const appointments = require("./appointments");
const userInfo = require("./user");
const supervisor = require("./supervisor");
const patientDashboard = require("./patientDashboard");
const carerDashboard = require("./carerDashboard");
const {
  findPatientsByCarergender,
  findPatientsByCarergenderAndDay,
} = require("./matchingPatient");
const { signup, patientSetup } = require("./signup");
const login = require("./login");

const resolvers = {
  Query: {
    addressLookup,
    users,
    carers,
    patients,
    appointments,
    userInfo,
    supervisor,
    patientDashboard,
    carerDashboard,
    findPatientsByCarergender,
    findPatientsByCarergenderAndDay,
  },
  Mutation: {
    signup,
    patientSetup,
    login,
  },
};

module.exports = resolvers;
