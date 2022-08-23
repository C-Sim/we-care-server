const { User, Carer, Patient, Supervisor, Address } = require("../models");
const { faker } = require("@faker-js/faker");

const prepareUsersData = () => {
  const users = [];

  //create a small number of supervisors
  for (let i = 0; i < 5; i += 1) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.exampleEmail();
    const password = "password123";
    const accountType = "supervisor";
    const approvedStatus = true;

    const user = {
      firstName,
      lastName,
      email,
      accountType,
      password,
      approvedStatus,
    };
    users.push(user);
  }

  //create a medium number of carers
  for (let i = 0; i < 20; i += 1) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.exampleEmail();
    const password = "password123";
    const accountType = "carer";
    const approvedStatus = true;

    const user = {
      firstName,
      lastName,
      email,
      accountType,
      password,
      approvedStatus,
    };
    users.push(user);
  }
  //create a large number of patients
  for (let i = 0; i < 100; i += 1) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.exampleEmail();
    const password = "password123";
    const accountType = "patient";
    const approvedStatus = true;

    const user = {
      firstName,
      lastName,
      email,
      accountType,
      password,
      approvedStatus,
    };
    users.push(user);
  }

  // return users array
  return users;
};

const createSecondProfile = async () => {
  const users = await User.find({});
  const postcode = "B295PZ";
  const userAddress = {
    formatted_address: [
      "30 Weoley Castle Road",
      "",
      "",
      "Birmingham",
      "West Midlands",
    ],
    thoroughfare: "Weoley Castle Road",
    building_name: "",
    sub_building_name: "",
    sub_building_number: "",
    building_number: "30",
    line_1: "30 Weoley Castle Road",
    line_2: "",
    line_3: "",
    line_4: "",
    locality: "",
    town_or_city: "Birmingham",
    county: "West Midlands",
    district: "Birmingham",
    country: "England",
  };

  const daysArray = [
    ["monday", "tuesday", "wednesday", "thursday", "friday"],
    ["tuesday", "wednesday", "thursday", "friday", "saturday"],
    ["wednesday", "thursday", "friday", "saturday", "sunday"],
    ["thursday", "friday", "saturday", "sunday", "monday"],
  ];
  const sexArray = ["female", "male"];

  for (let i = 0; i < users.length; i += 1) {
    const { _id: userId } = users[i];
    const { accountType } = users[i];
    const username = `${users[i].firstName} ${users[i].lastName}`;
    const address = userAddress;
    const appointments = [];
    const notifications = [];
    const sex = sexArray[Math.floor(Math.random() * sexArray.length)];

    if (accountType === "carer") {
      const days = daysArray[Math.floor(Math.random() * 4)];
      const newCarerData = {
        userId,
        username,
        postcode,
        address,
        days,
        sex,
        appointments,
        notifications,
      };
      const newCarer = await Carer.create(newCarerData);
    } else if (accountType === "patient") {
      const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const newPatientData = {
        userId,
        username,
        postcode,
        address,
        days,
        sex,
        appointments,
        notifications,
      };
      const newPatient = await Patient.create(newPatientData);
    } else {
      const assignedCarers = [];
      const newSupervisorData = { userId, username, assignedCarers, notifications };
      const newSupervisor = await Supervisor.create(newSupervisorData);
    }
  }
};

const seedUsers = async () => {
  const users = await prepareUsersData();
  const promises = users.map((user) => User.create(user));

  await Promise.all(promises);

  const profiles = await createSecondProfile();

  console.log("[INFO]: Successfully seeded users");
};

module.exports = { seedUsers };
