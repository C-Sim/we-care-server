const { AuthenticationError, ApolloError } = require("apollo-server");
const { Appointment, Supervisor, Carer, Patient, User } = require("../models");
const sendNotification = require("./sendNotification");
const { addDays } = require("date-fns");

//for future development - supervisor consulting carer profile
const appointmentsById = async (_, { userId }, { user }) => {
  try {
    if (user) {
      const appointment = await Appointment.find({ carerId: userId })
        .populate({
          path: "patientId",
          populate: [
            { path: "patientProfileId", model: "Patient" },
            { path: "address" },
          ],
        })
        .populate("carerId");
      return appointment;
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    return new ApolloError(
      `Failed to perform this operation | ${error.message}`
    );
  }
};

//the carer will pass the userId and get the notes for that patient
const appointmentNotesByUserId = async (_, { userId }, { user }) => {
  try {
    if (user) {
      const appointments = await Appointment.find({
        patientId: userId,
      }).sort({ start: -1 });
      return appointments;
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    return new ApolloError(
      `Failed to perform this operation | ${error.message}`
    );
  }
};

//all the appointments are retrieved for the logged in user
const appointmentsByUserId = async (_, __, { user }) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ carerId: user.id }, { patientId: user.id }],
    })
      .populate({
        path: "patientId",
        populate: [
          { path: "patientProfileId", model: "Patient" },
          { path: "address" },
        ],
      })
      .populate({
        path: "carerId",
        populate: { path: "carerProfileId", model: "Carer" },
      });
    return appointments;
  } catch (error) {
    return new ApolloError(
      `Failed to perform this operation | ${error.message}`
    );
  }
};

//the appointments for the next working day for the logged in carer
const appointmentsForNextWorkingDay = async (_, __, { user }) => {
  try {
    const allAppointments = await Appointment.find({
      carerId: user.id,
    })
      .sort("start")
      .populate({
        path: "patientId",
        populate: [
          { path: "patientProfileId", model: "Patient" },
          { path: "address" },
        ],
      })
      .populate("carerId");

    //check from today which date has appointments and stop of the first one that returns appointments

    //set variables starting on today's date
    let date = new Date();
    let limitDate = addDays(date, 7);
    const appointments = [];
    //filter appointments on that date
    while (appointments.length === 0 && date !== limitDate) {
      const dayStart = new Date(date.setUTCHours(1, 0, 0));
      const dayEnd = new Date(date.setUTCHours(23, 0, 0));

      const appointmentsThisDay = allAppointments.filter(
        (i) =>
          new Date(i.start) > new Date(dayStart) &&
          new Date(i.end) < new Date(dayEnd)
      );
      if (appointmentsThisDay.length !== 0) {
        appointments.push(...appointmentsThisDay);
      } else {
        date = addDays(dayStart, 1);
      }
    }
    //if array returned is empty, then filter on next day
    //stop on limit date or when array contains appointments

    return appointments;
  } catch (error) {
    return new ApolloError(
      `Failed to perform this operation | ${error.message}`
    );
  }
};

//the appointments for the next week for the logged in patient
const appointmentsForNextWeek = async (_, __, { user }) => {
  try {
    const allAppointments = await Appointment.find({
      patientId: user.id,
    })
      .sort("start")
      .populate({
        path: "carerId",
        populate: [
          { path: "carerProfileId", model: "Carer" },
          { path: "address" },
        ],
      })
      .populate("patientId");

    //check from today which date has appointments and stop of the first one that returns appointments

    //set variables starting on today's date
    const date = new Date();
    const weekStart = new Date(date.setUTCHours(1, 0, 0));
    const weekEnd = new Date(addDays(date, 7).setUTCHours(23, 0, 0));
    const appointments = [];
    //filter appointments for that period

    const appointmentsThisWeek = allAppointments.filter(
      (i) =>
        new Date(i.start) > new Date(weekStart) &&
        new Date(i.end) < new Date(weekEnd)
    );
    if (appointmentsThisWeek.length !== 0) {
      appointments.push(...appointmentsThisWeek);
    }

    return appointments;
  } catch (error) {
    return new ApolloError(
      `Failed to perform this operation | ${error.message}`
    );
  }
};

//the appointments for a specific date are retrieved for the logged in user
const appointmentsByDateAndUserId = async (_, { dateInput }, { user }) => {
  try {
    const appointments = await Appointment.find({
      $and: [
        { $or: [{ carerId: user.id }, { patientId: user.id }] },
        {
          appointmentDate: {
            $gte: new Date(dateInput.dayStart),
            $lte: new Date(dateInput.dayEnd),
          },
        },
      ],
    })
      .sort("start")
      .populate({
        path: "patientId",
        populate: { path: "patientProfileId", model: "Patient" },
      })
      .populate("carerId");
    //can switch to sort({start: -1}) to have it in descending order - latest appointment first
    return appointments;
  } catch (error) {
    return new ApolloError(
      `Failed to perform this operation | ${error.message}`
    );
  }
};

//for future development - supervisor creating only 1 specific appointment
const createAppointment = async (_, { appointmentInput }, { user }) => {
  try {
    if (user.accountType === "supervisor") {
      const createdAppointment = await Appointment.create(appointmentInput);
      const { _id } = createdAppointment;

      //update carer's appointments array
      const carerToUpdate = await Carer.findOneAndUpdate(
        { userId: appointmentInput.carerId },
        {
          $push: {
            appointments: _id,
          },
        }
      );

      //update patient's appointments array
      const patientToUpdate = await Patient.findOneAndUpdate(
        { userId: appointmentInput.patientId },
        {
          $push: {
            appointments: _id,
          },
        }
      );

      return {
        success: true,
        id: _id,
      };
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to create appointment | ${error.message}`);

    throw new ApolloError("Failed to create appointment");
  }
};

//supervisor assign page - assigning all patients to the selected carer for the selected date
const createAppointments = async (_, { appointments }, { user }) => {
  if (user.accountType === "supervisor") {
    //function to run every time
    const createOneAppointment = async (appointmentInput) => {
      try {
        const createdAppointment = await Appointment.create(appointmentInput);
        const { _id } = createdAppointment;

        //update carer's appointments array
        const carerToUpdate = await Carer.findOneAndUpdate(
          { userId: appointmentInput.carerId },
          {
            $push: {
              appointments: _id,
            },
          }
        );

        //update patient's appointments array
        const patientToUpdate = await Patient.findOneAndUpdate(
          { userId: appointmentInput.patientId },
          {
            $push: {
              appointments: _id,
            },
          }
        );

        return {
          success: true,
        };
      } catch (error) {
        console.log(`[ERROR]: Failed to create appointment | ${error.message}`);

        throw new ApolloError("Failed to create appointment");
      }
    };

    const promises = appointments.map((a) => {
      return createOneAppointment(a);
    });

    await Promise.all(promises);

    return { success: true };
  } else {
    return new AuthenticationError(
      "You are not authorized to perform this operation"
    );
  }
};

//for future development - supervisor deleting only 1 specific appointment
const deleteAppointment = async (_, { appointmentId }, { user }) => {
  if (user.accountType == "supervisor") {
    try {
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        console.log(`[ERROR]: Appointment not found | ${appointmentId}`);

        throw new ApolloError("Appointment not found");
      }

      const { carerId, patientId, _id } = appointment;
      const deletedAppointment = await Appointment.findByIdAndDelete(_id);

      //update carer's appointments array
      const carerToUpdate = await Carer.findOneAndUpdate(
        { userId: carerId },
        {
          $pull: {
            appointments: _id,
          },
        }
      );

      //update patient's appointments array
      const patientToUpdate = await Patient.findOneAndUpdate(
        { userId: patientId },
        {
          $pull: {
            appointments: _id,
          },
        }
      );

      return {
        success: true,
        carerId,
        patientId,
      };
    } catch (error) {
      console.log(`[ERROR]: Failed to delete appointment | ${error.message}`);

      throw new ApolloError("Failed to delete appointment");
    }
  } else {
    return new AuthenticationError(
      "You are not authorized to perform this operation"
    );
  }
};

//used by carer and patient to update certain fields of the targeted appointment
const updateAppointment = async (
  _,
  { appointmentId, trigger, appointmentUpdateInput },
  { user }
) => {
  if (user) {
    try {
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        console.log(`[ERROR]: Appointment not found | ${appointmentId}`);

        throw new ApolloError("Appointment not found");
      }

      let updatedAppointment;
      switch (trigger) {
        case "checkin":
          const actualStart = new Date();
          updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId },
            {
              $set: { actualStart, status: "ongoing" },
            },
            {
              new: true,
            }
          )
            .populate("patientId")
            .populate("carerId");
          break;
        case "checkout":
          //create the actual end time
          const actualEnd = new Date();
          //update the actualEnd field and the status in the Appointment document
          appointment.actualEnd = actualEnd;
          appointment.status = "completed";
          updatedEnd = await appointment.save();

          //get the fields we need for the notification prep
          const userId = appointment.carerId;
          const filterTime = appointment.end;
          const selectedDate = new Date(filterTime);
          const dayStart = selectedDate.setUTCHours(0, 0, 0, 0);
          const dayEnd = selectedDate.setUTCHours(23, 59, 59, 999);

          //get all appointments for that day
          const appointments = await Appointment.find({
            $and: [
              { carerId: userId },
              {
                appointmentDate: {
                  $gte: new Date(dayStart),
                  $lte: new Date(dayEnd),
                },
              },
            ],
          }).sort("start");

          //find this appointment's position in the array
          const followingAppointments = appointments.filter(
            (i) => new Date(i.start) > new Date(filterTime)
          );

          //if not the last one, find the next appointment and get the patient id
          if (followingAppointments.length) {
            const nextAppointmentId = followingAppointments[0].id;
            const receiverId = followingAppointments[0].patientId;
            //send notification to patient "Your carer is on their way to you" (patientId = receiverId)
            const patientNotified = await sendNotification({
              senderId: userId,
              receiverType: "patient",
              receiverId,
              notificationType: "Update",
              notificationText: "Your carer is on their way to you!",
              appointmentId: nextAppointmentId,
            });
          }
          //recall the complete appointment document for frontend rendering
          updatedAppointment = await Appointment.findById(appointmentId)
            .populate("patientId")
            .populate("carerId");

          break;
        case "carerNote":
          const carerNote = appointmentUpdateInput.note;
          updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId },
            {
              $push: {
                carerNotes: carerNote,
              },
            },
            {
              new: true,
            }
          );
          break;
        case "patientNote":
          const patientNote = appointmentUpdateInput.note;
          updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId },
            {
              $push: {
                patientNotes: patientNote,
              },
            },
            {
              new: true,
            }
          );

          //notify previous carer
          const carerNotified = await sendNotification({
            senderId: updatedAppointment.patientId,
            receiverType: "carer",
            receiverId: updatedAppointment.carerId,
            notificationType: "New care requirement",
            notificationText:
              "The patient has added a note for their upcoming appointment",
            appointmentId,
          });
          break;
        case "carerChange":
          const previousCarerId = appointment.carerId;
          const newCarerId = appointmentUpdateInput.carerId;
          const { start, end } = appointmentUpdateInput;
          updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId },
            {
              $set: { carerId: newCarerId, start, end },
            },
            {
              new: true,
            }
          );

          //update previous carer's appointments
          const previousCarerToUpdate = await Carer.findOneAndUpdate(
            { userId: previousCarerId },
            {
              $pull: {
                appointments: appointmentId,
              },
            }
          );

          const supervisorId = user.id;
          //notify previous carer
          const previousCarerNotified = await sendNotification({
            senderId: supervisorId,
            receiverType: "carer",
            receiverId: previousCarerId,
            notificationType: "Schedule change",
            notificationText:
              "Your request has been approved and the appointment has been removed from your schedule",
            appointmentId,
          });

          //update new carer's appointments
          const newCarerToUpdate = await Carer.findOneAndUpdate(
            { userId: newCarerId },
            {
              $push: {
                appointments: appointmentId,
              },
            }
          );

          ///notify new carer
          const newCarerNotified = await sendNotification({
            senderId: supervisorId,
            receiverType: "carer",
            receiverId: newCarerId,
            notificationType: "Schedule change",
            notificationText:
              "You have been assigned a new appointment in your schedule",
            appointmentId,
          });

          //notify patient of the update
          const patientNotified = await sendNotification({
            senderId: supervisorId,
            receiverType: "patient",
            receiverId: appointment.patientId,
            notificationType: "Carer change",
            notificationText: "Your carer for that appointment has changed.",
            appointmentId,
          });

          break;
      }

      return {
        success: true,
      };
    } catch (error) {
      console.log(`[ERROR]: Failed to update appointment | ${error.message}`);

      throw new ApolloError("Failed to update appointment");
    }
  } else {
    return new AuthenticationError(
      "You are not authorized to perform this operation"
    );
  }
};

//for future development - used by patients to leave a review on one of their appointments
const updateAppointmentReview = async (
  _,
  { reviewInput, appointmentId },
  { user }
) => {
  if (user && user.accountType === "patient") {
    try {
      //find the appointment data
      const appointment = await Appointment.findById(appointmentId);
      //add fields to the review input
      reviewInput.appointmentId = appointmentId;
      reviewInput.patientId = appointment.patientId;
      reviewInput.carerId = appointment.carerId;

      //update the "patientReview" subdocument in the appointment document
      appointment.patientReview = reviewInput;
      const updatedAppointment = await appointment.save();

      return {
        success: true,
        userId: appointment.patientId,
      };
    } catch (error) {
      console.log(`[ERROR]: Failed to update review | ${error.message}`);
    }
  } else {
    return new AuthenticationError(
      "You are not authorized to perform this operation"
    );
  }
};

//used by carers to ask for one of their appointments be taken off their schedule and given to another carer
const askForReallocation = async (_, { appointmentId }, { user }) => {
  if (user && user.accountType === "carer") {
    try {
      //find the appointment data
      const appointment = await Appointment.findById(appointmentId);

      const supervisor = await User.findOne({ accountType: "supervisor" });
      //create notification
      const supervisorNotified = await sendNotification({
        senderId: user.id,
        receiverType: "supervisor",
        receiverId: supervisor.id,
        notificationType: "Schedule change",
        notificationText:
          "A carer has asked for one of their appointment to be rescheduled.",
        appointmentId,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.log(`[ERROR]: Failed to create Notification | ${error.message}`);
    }
  } else {
    return new AuthenticationError(
      "You are not authorized to perform this operation"
    );
  }
};

module.exports = {
  appointmentsById,
  appointmentsByUserId,
  appointmentNotesByUserId,
  appointmentsByDateAndUserId,
  appointmentsForNextWorkingDay,
  appointmentsForNextWeek,
  askForReallocation,
  createAppointment,
  createAppointments,
  deleteAppointment,
  updateAppointment,
  updateAppointmentReview,
};
