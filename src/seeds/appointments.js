const {
  User,
  Carer,
  Patient,
  Appointment,
  Notification,
} = require("../models");
const { faker } = require("@faker-js/faker");
const { addHours, subMinutes, addDays, subDays } = require("date-fns");

const reviews = [
  "Great carer, they are always on time and so thoughtful and gentle. I really appreciate how friendly they are too.",
  "I've been carer for by this carer for 3 years now and it's been really good! Very reliable!",
  "Good carer with good manners!",
  "I'm happy that we found such a good carer for my mum. It can be quite difficult to keep one long term with her condition but this one is great and I hope it continues long term!",
  "Very pleased with the level of care and the attention to details from the WeCare carer.",
  "Very good, would definitely recommend!",
];

const prepareAppointmentsData = async () => {
  const carers = await Carer.find({});
  const carer = carers[0];
  const carerGender = carer.gender;

  const patients = await Patient.find({
    genderPreference: { $in: [carerGender, "none"] },
  });

  //selecting 5 patients
  const chosenPatients = patients.slice(0, 5);

  const carerId = carer.userId;
  const carerUsername = carer.username;

  for (let j = 0; j < chosenPatients.length; j += 1) {
    const patientId = chosenPatients[j].userId;
    const review = {
      reviewDate: faker.date.recent(),
      score: 5,
      comment: reviews[j],
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

  //set a midpoint for seeding - today's date (included in completed period)
  const midpoint = new Date(new Date().setUTCHours(7, 0, 0));

  //create a number of completed appointments
  for (let ii = 1; ii < 11; ii += 1) {
    const d = subDays(midpoint, 10);

    const dayStart = d.setDate(d.getDate() + ii);

    for (let iii = 0; iii < chosenPatients.length; iii += 1) {
      const start = addHours(dayStart, iii * 2);
      const end = addHours(start, 1);
      const appointmentDate = start;
      const status = "completed";
      const actualStart = start;
      const actualEnd = end;
      const patientId = chosenPatients[iii].userId;
      const patientUsername = chosenPatients[iii].username;
      const title = `Visit to ${patientUsername} by ${carerUsername}`;
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
        isProcessed: true,
        senderId: carerId,
        receiverId: patientId,
        appointmentId: _id,
        appointmentDate: appointmentDate,
        patientUsername: patientUsername,
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

  //create a number of upcoming appointments
  for (let ii = 1; ii < 11; ii += 1) {
    const d = midpoint;

    const dayStart = d.setDate(d.getDate() + ii);

    for (let iii = 0; iii < chosenPatients.length; iii += 1) {
      const start = addHours(dayStart, iii * 2);
      const end = addHours(start, 1);
      const appointmentDate = start;
      const status = "upcoming";
      const patientId = chosenPatients[iii].userId;
      const patientUsername = chosenPatients[iii].username;
      const title = `Visit to ${patientUsername} by ${carerUsername}`;

      const appointment = {
        appointmentDate,
        title,
        start,
        end,
        status,
        patientId,
        carerId,
      };

      const createdAppointment = await Appointment.create(appointment);
      const { _id } = createdAppointment;

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
          },
        }
      );
    }
  }
};

const seedAppointments = async () => {
  const data = await prepareAppointmentsData();
  console.log("[INFO]: Successfully seeded appointments");
};

module.exports = { seedAppointments };
