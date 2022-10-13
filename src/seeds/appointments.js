const {
  User,
  Carer,
  Patient,
  Appointment,
  Notification,
  Supervisor,
} = require("../models");
const { getDay } = require("date-fns");
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
  //get week carer
  const weekCarers = await Carer.find({ days: "monday" });
  const weekCarer = weekCarers[0];

  //get weekend carer
  const weekendCarers = await Carer.find({ days: "sunday" });
  const weekendCarer = weekendCarers[0];

  //get patients
  const patients = await Patient.find({});
  //selecting 5 patients
  const chosenPatients = patients.slice(0, 5);

  //each patient gives each carer a review
  for (let j = 0; j < chosenPatients.length; j += 1) {
    const patientId = chosenPatients[j].userId;
    //to weekCarer
    const weekCarerId = weekCarer.userId;
    const weekReview = {
      reviewDate: faker.date.recent(),
      score: 5,
      comment: reviews[j],
      patientId: patientId,
      carerId: weekCarerId,
    };
    const weekCarerToUpdate = await Carer.findOneAndUpdate(
      { userId: weekCarerId },
      {
        $push: {
          reviews: weekReview,
        },
      }
    );

    //to weekendCarer
    const weekendCarerId = weekendCarer.userId;
    const weekendReview = {
      reviewDate: faker.date.recent(),
      score: 5,
      comment: reviews[j],
      patientId: patientId,
      carerId: weekendCarerId,
    };
    const weekendCarerToUpdate = await Carer.findOneAndUpdate(
      { userId: weekendCarerId },
      {
        $push: {
          reviews: weekendReview,
        },
      }
    );
  }

  //set a midpoint for seeding - today's date (included in completed period)
  const midpoint = new Date(new Date().setUTCHours(7, 0, 0));

  //create a number of completed appointments
  for (let jj = 1; jj < 11; jj += 1) {
    const d = subDays(midpoint, 10);

    const dayStart = d.setDate(d.getDate() + jj);

    //set carer info for this date
    let carerId;
    let carerUsername;
    //getting day of the week for the selected date
    const day = getDay(dayStart);

    if (day > 0 && day < 5) {
      carerId = weekCarer.userId;
      carerUsername = weekCarer.username;
    } else {
      carerId = weekendCarer.userId;
      carerUsername = weekendCarer.username;
    }

    for (let jjj = 0; jjj < chosenPatients.length; jjj += 1) {
      const start = addHours(dayStart, jjj * 2);
      const end = addHours(start, 1);
      const appointmentDate = start;
      const status = "completed";
      const actualStart = start;
      const actualEnd = end;
      const patientId = chosenPatients[jjj].userId;
      const patientUsername = chosenPatients[jjj].username;
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

      await Carer.findOneAndUpdate(
        { userId: carerId },
        {
          $push: {
            appointments: _id,
          },
        }
      );

      await Patient.findOneAndUpdate(
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
  for (let ii = 1; ii < 19; ii += 1) {
    const dayStart = addDays(midpoint, ii);

    //set carer info for this date
    let carerId;
    let carerUsername;
    //getting day of the week for the selected date
    const day = getDay(dayStart);
    if (day > 0 && day < 5) {
      carerId = weekCarer.userId;
      carerUsername = weekCarer.username;
    } else {
      carerId = weekendCarer.userId;
      carerUsername = weekendCarer.username;
    }

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

      await Carer.findOneAndUpdate(
        { userId: carerId },
        {
          $push: {
            appointments: _id,
          },
        }
      );

      await Patient.findOneAndUpdate(
        { userId: patientId },
        {
          $push: {
            appointments: _id,
          },
        }
      );
    }
  }

  //ask for reallocation for the last appointment created
  const appointments = await Appointment.find({});
  const supervisor = await User.findOne({ accountType: "supervisor" });

  const supervisorId = supervisor.id;

  const appointmentToReallocate = appointments.pop();
  const senderId = appointmentToReallocate.carerId;

  const { _id } = appointmentToReallocate;
  const notification = {
    notificationDate: new Date(),
    isRead: false,
    isProcessed: false,
    senderId: senderId,
    receiverId: supervisorId,
    appointmentId: _id,
    appointmentDate: appointmentToReallocate.appointmentDate,
    patientUsername: appointmentToReallocate.patientUsername,
    notificationText:
      "The carer has asked for this appointment to be rescheduled. Please review and approve or deny the request.",
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
};

const seedAppointments = async () => {
  const data = await prepareAppointmentsData();
  console.log("[INFO]: Successfully seeded appointments");
};

module.exports = { seedAppointments };
