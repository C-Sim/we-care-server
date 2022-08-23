const addressLookup = require("./addressLookup");
const users = require("./users");
const appointments = require("./appointments");
const userInfo = require("./user");
const patientDashboard = require("./patientDashboard");
const carerDashboard = require("./carerDashboard");
const {
  findPatientsByCarergender,
  findPatientsByCarergenderAndDay,
} = require("./matchingPatient");

const resolvers = {
  Query: {
    addressLookup,
    users,
    appointments,
    userInfo,
    patientDashboard,
    carerDashboard,
    findPatientsByCarergender,
    findPatientsByCarergenderAndDay,
  },
  //   Mutation: {
  //     createUser,
  //     createThought,
  //     createReaction,
  //   },
};

module.exports = resolvers;
