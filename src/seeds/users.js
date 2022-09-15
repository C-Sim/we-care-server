const {
  User,
  Carer,
  Patient,
  Supervisor,
  Address,
  AddressLookup,
  Notification,
} = require("../models");
const { faker } = require("@faker-js/faker");

const prepareUsersData = async () => {
  const addressesFromDB = await AddressLookup.findOne({
    postcode: "B12 9LP",
  });
  const users = [];
  const postcode = "B12 9LP";
  const address = addressesFromDB.addresses[0];

  //create a small number of supervisors
  for (let i = 0; i < 1; i += 1) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = "supervisor@example.org";
    const imageUrl = faker.image.people(640, 480, true);
    const password = "password123";
    const accountType = "supervisor";
    const phoneNumber = "07777777777";
    const approvedStatus = true;

    const user = {
      firstName,
      lastName,
      email,
      imageUrl,
      phoneNumber,
      accountType,
      password,
      approvedStatus,
      postcode,
      address,
    };
    users.push(user);
  }

  //create a medium number of carers
  for (let i = 0; i < 20; i += 1) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.exampleEmail();
    const imageUrl = faker.image.people(640, 480, true);
    const password = "password123";
    const accountType = "carer";
    const phoneNumber = "07777777777";
    const approvedStatus = true;

    const user = {
      firstName,
      lastName,
      email,
      imageUrl,
      phoneNumber,
      accountType,
      password,
      approvedStatus,
      postcode,
      address,
    };
    users.push(user);
  }
  //create a large number of patients
  for (let i = 0; i < 100; i += 1) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.exampleEmail();
    const imageUrl = faker.image.people(640, 480, true);
    const password = "password123";
    const accountType = "patient";
    const phoneNumber = "07777777777";
    const approvedStatus = true;

    const user = {
      firstName,
      lastName,
      email,
      imageUrl,
      phoneNumber,
      accountType,
      password,
      approvedStatus,
      postcode,
      address,
    };
    users.push(user);
  }

  // return users array
  return users;
};

const createSecondProfile = async () => {
  const users = await User.find({});

  const daysArray = [
    ["monday", "tuesday", "wednesday", "thursday", "friday"],
    ["tuesday", "wednesday", "thursday", "friday", "saturday"],
    ["wednesday", "thursday", "friday", "saturday", "sunday"],
    ["thursday", "friday", "saturday", "sunday", "monday"],
  ];
  const genderArray = ["female", "male"];

  for (let i = 0; i < users.length; i += 1) {
    const { _id: userId } = users[i];
    const { accountType } = users[i];
    const username = `${users[i].firstName} ${users[i].lastName}`;
    const appointments = [];
    const notifications = [];
    const gender = genderArray[Math.floor(Math.random() * genderArray.length)];

    if (accountType === "carer") {
      const days = daysArray[Math.floor(Math.random() * 4)];
      const newCarerData = {
        userId,
        username,
        days,
        gender,
        appointments,
        notifications,
      };
      const newCarer = await Carer.create(newCarerData);
      const carerProfileId = newCarer._id;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { carerProfileId } },
        { new: true }
      );
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
        days,
        gender,
        appointments,
        notifications,
      };
      const newPatient = await Patient.create(newPatientData);
      const patientProfileId = newPatient._id;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { patientProfileId } },
        { new: true }
      );
    } else {
      const assignedCarers = [];
      const newSupervisorData = {
        userId,
        username,
        assignedCarers,
        notifications,
      };
      const newSupervisor = await Supervisor.create(newSupervisorData);
      const supervisorProfileId = newSupervisor.id;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { supervisorProfileId } },
        { new: true }
      );
    }
  }
};

const addNewPatients = async () => {
  const addressesFromDB = await AddressLookup.findOne({
    postcode: "B12 9LP",
  });
  const users = [];
  const postcode = "B12 9LP";
  const address = addressesFromDB.addresses[0];
  //create a large number of patients
  for (let i = 0; i < 5; i += 1) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.exampleEmail();
    const imageUrl = faker.image.people(640, 480, true);
    const password = "password123";
    const accountType = "patient";
    const phoneNumber = "07777778887";
    const approvedStatus = false;

    const user = {
      firstName,
      lastName,
      email,
      imageUrl,
      phoneNumber,
      accountType,
      password,
      approvedStatus,
      postcode,
      address,
    };
    users.push(user);
  }

  const supervisor = await User.findOne({ accountType: "supervisor" });
  const supervisorId = supervisor.id;

  for (let i = 0; i < users.length; i += 1) {
    const userData = users[i];
    const user = await User.create(userData);

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
      userId: user.id,
      username: `${user.firstName} ${user.lastName}`,
      days,
      gender: "male",
      genderPreference: "none",
      appointments: [],
      notifications: [],
    };
    const newPatient = await Patient.create(newPatientData);
    const patientProfileId = newPatient._id;
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $set: { patientProfileId } },
      { new: true }
    );

    //create notification to supervisor
    const notification = {
      notificationDate: new Date(),
      isRead: false,
      isProcessed: false,
      senderId: user.id,
      receiverId: supervisorId,
      appointmentId: "null",
      appointmentDate: "null",
      patientUsername: newPatient.username,
      notificationType: "New patient review",
      notificationText:
        "New patient signup - Please review their profile and approve or decline the request.",
    };
    const newNotification = await Notification.create(notification);
    const notificationId = newNotification._id;

    const supervisorToUpdate = await Supervisor.findOneAndUpdate(
      { userId: supervisorId },
      {
        $push: {
          notifications: notificationId,
        },
      }
    );
  }
};

const seedUsers = async () => {
  const users = await prepareUsersData();
  const promises = users.map((user) => User.create(user));

  await Promise.all(promises);

  const profiles = await createSecondProfile();

  const newPatients = await addNewPatients();

  console.log("[INFO]: Successfully seeded users");
};

module.exports = { seedUsers };
