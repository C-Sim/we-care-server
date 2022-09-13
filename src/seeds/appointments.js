const {
  User,
  Carer,
  Patient,
  Appointment,
  Notification,
} = require("../models");
const { faker } = require("@faker-js/faker");
const { addHours, subMinutes } = require("date-fns");

const usedPatients = [];

const prepareFemaleAppointmentsData = async () => {
  const femalePatients = await Patient.find({
    genderPreference: { $in: ["male", "none"] },
  });
  const femaleCarers = await Carer.find({ gender: "female" });

  //assigning female carers and patients

  let f = 0;
  for (let i = 0; i < 5; i += 1) {
    const carerId = femaleCarers[i].userId;
    const carerUsername = femaleCarers[i].username;
    let chosenPatients = [];
    for (let j = f; j < f + 5; j += 1) {
      const patient = femalePatients[j];
      chosenPatients.push(patient);
      usedPatients.push(patient);

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
    for (let ii = 1; ii < 11; ii += 1) {
      const d = new Date("2022-09-04T07:00:00.000+00:00");

      const dayStart = d.setDate(d.getDate() + ii);

      for (let iii = 0; iii < chosenPatients.length; iii += 1) {
        const start = addHours(dayStart, iii * 2);
        const end = addHours(start, 1);
        const appointmentDate = start;
        const status = "completed";
        const actualStart = start;
        const actualEnd = end;
        const patientId = chosenPatients[iii].userId;
        const title = `Visit to ${chosenPatients[iii].username} by ${carerUsername}`;
        const carerNotes = [];
        const firstNote = faker.lorem.sentences(3);
        carerNotes.push(firstNote);
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
          carerNotes,
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
          appointmentDate: appointmentDate,
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
    chosenPatients = [];
    f += 5;
  }
};

const prepareMaleAppointmentsData = async () => {
  const patients = await Patient.find({
    genderPreference: { $in: ["male", "none"] },
  });

  const maleCarers = await Carer.find({ gender: "male" });

  //assigning male carers and patients
  const malePatients = patients.filter((el) => {
    return usedPatients.every((f) => {
      return f.username !== el.username;
    });
  });

  let m = 0;
  for (let i = 0; i < 5; i += 1) {
    const carerId = maleCarers[i].userId;
    const carerUsername = maleCarers[i].username;
    let chosenPatients = [];
    for (let j = m; j < m + 5; j += 1) {
      const patient = malePatients[j];
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
    for (let ii = 1; ii < 11; ii += 1) {
      const d = new Date("2022-09-04T07:00:00.000+00:00");

      const dayStart = d.setDate(d.getDate() + ii);

      for (let iii = 0; iii < chosenPatients.length; iii += 1) {
        const start = addHours(dayStart, iii * 2);
        const end = addHours(start, 1);
        const appointmentDate = start;
        const status = "completed";
        const actualStart = start;
        const actualEnd = end;
        const patientId = chosenPatients[iii].userId;
        const title = `Visit to ${chosenPatients[iii].username} by ${carerUsername}`;
        const carerNotes = [];
        const firstNote = faker.lorem.sentences(3);
        carerNotes.push(firstNote);
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
          carerNotes,
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
          appointmentDate: appointmentDate,
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
    chosenPatients = [];
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
