const {
  User,
  Carer,
  Patient,
  Appointment,
  Notification,
} = require("../models");
const { faker } = require("@faker-js/faker");
const { addHours, subMinutes } = require("date-fns");

const prepareFemaleAppointmentsData = async () => {
  const patients = await Patient.find({});
  const carers = await Carer.find({});

  //assigning female carers and patients
  const femaleCarers = carers.filter((item) => item.gender === "female");
  const femalePatients = patients.filter((item) => item.gender === "female");
  let f = 0;
  for (let i = 0; i < 3; i += 1) {
    const carerId = femaleCarers[i].userId;
    const carerUsername = femaleCarers[i].username;
    const chosenPatients = [];
    for (let j = f; j < f + 5; j += 1) {
      const patient = femalePatients[f];
      chosenPatients.push(patient);

      const patientId = patient.userId;
      const review = {
        reviewDate: faker.date.recent(),
        score: 5,
        comment: "Good carer - very gentle",
        patientId: patientId,
        carerId: carerId,
      };
      const carerToUpdate = await Carer.findOneAndUpdate(
        { userId: carerId },
        {
          $push: {
            reviews: review,
          },
        }
      );
    }

    //create a number of appointments
    for (let ii = 1; ii < 6; ii += 1) {
      const dayStart = new Date(2022, 8, ii, 8, 0);

      for (let iii = 0; iii < chosenPatients.length; iii += 1) {
        const appointmentDate = dayStart;
        const start = addHours(dayStart, iii * 2);
        const end = addHours(start, 1);
        const status = "completed";
        const actualStart = start;
        const actualEnd = end;
        const patientId = chosenPatients[iii].userId;
        const title = `Visit to ${chosenPatients[iii].username} by ${carerUsername}`;
        const notes = [];
        const patientReview = {
          reviewDate: addHours(start, 6),
          score: 3,
          comment: "Good care",
          patientId: patientId,
        };

        const appointment = {
          appointmentDate,
          title,
          start,
          end,
          status,
          actualStart,
          actualEnd,
          patientId,
          carerId,
          notes,
          patientReview,
        };

        const createdAppointment = await Appointment.create(appointment);
        const { _id } = createdAppointment;
        const notification = {
          notificationDate: subMinutes(start, 30),
          isRead: true,
          senderId: carerId,
          receiverId: patientId,
          appointmentId: _id,
          notificationText: "Your carer is on their way to you!",
        };
        const newNotification = await Notification.create(notification);
        const notificationId = newNotification._id;

        const carerToUpdate = await Carer.findOneAndUpdate(
          { userId: carerId },
          {
            $push: {
              appointments: _id,
            },
          }
        );
        const patientToUpdate = await Patient.findOneAndUpdate(
          { userId: patientId },
          {
            $push: {
              appointments: _id,
              notifications: notificationId,
            },
          }
        );
      }
    }
    f += 5;
  }
};

const prepareMaleAppointmentsData = async () => {
  const patients = await Patient.find({});
  const carers = await Carer.find({});

  //assigning male carers and patients
  const maleCarers = carers.filter((item) => item.gender === "male");
  const malePatients = patients.filter((item) => item.gender === "male");
  let m = 0;
  for (let i = 0; i < 3; i += 1) {
    const carerId = maleCarers[i].userId;
    const carerUsername = maleCarers[i].username;
    const chosenPatients = [];
    for (let j = m; j < m + 5; j += 1) {
      const patient = malePatients[m];
      chosenPatients.push(patient);

      const patientId = patient.userId;
      const review = {
        reviewDate: faker.date.recent(),
        score: 5,
        comment: "Good carer - very gentle",
        patientId: patientId,
        carerId: carerId,
      };
      const carerToUpdate = await Carer.findOneAndUpdate(
        { userId: carerId },
        {
          $push: {
            reviews: review,
          },
        }
      );
    }

    //create a number of appointments
    for (let ii = 1; ii < 6; ii += 1) {
      const dayStart = new Date(2022, 8, ii, 8, 0);

      for (let iii = 0; iii < chosenPatients.length; iii += 1) {
        const appointmentDate = dayStart;
        const start = addHours(dayStart, iii * 2);
        const end = addHours(start, 1);
        const status = "completed";
        const actualStart = start;
        const actualEnd = end;
        const patientId = chosenPatients[iii].userId;
        const title = `Visit to ${chosenPatients[iii].username} by ${carerUsername}`;
        const notes = [];
        const patientReview = {
          reviewDate: addHours(start, 6),
          score: 3,
          comment: "Good care",
          patientId: patientId,
        };

        const appointment = {
          appointmentDate,
          title,
          start,
          end,
          status,
          actualStart,
          actualEnd,
          patientId,
          carerId,
          notes,
          patientReview,
        };

        const createdAppointment = await Appointment.create(appointment);
        const { _id } = createdAppointment;
        const notification = {
          notificationDate: subMinutes(start, 30),
          isRead: true,
          senderId: carerId,
          receiverId: patientId,
          appointmentId: _id,
          notificationText: "Your carer is on their way to you!",
        };
        const newNotification = await Notification.create(notification);
        const notificationId = newNotification._id;

        const carerToUpdate = await Carer.findOneAndUpdate(
          { userId: carerId },
          {
            $push: {
              appointments: _id,
            },
          }
        );
        const patientToUpdate = await Patient.findOneAndUpdate(
          { userId: patientId },
          {
            $push: {
              appointments: _id,
              notifications: notificationId,
            },
          }
        );
      }
    }
    m += 5;
  }
};

const seedAppointments = async () => {
  const female = await prepareFemaleAppointmentsData();
  console.log("[INFO]: Successfully seeded female appointments");

  const male = await prepareMaleAppointmentsData();
  console.log("[INFO]: Successfully seeded male appointments");
};

module.exports = { seedAppointments };
