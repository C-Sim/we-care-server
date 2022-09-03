const { ApolloError } = require("apollo-server");
const { Appointment, Supervisor, Carer, Patient } = require("../models");
const sendNotification = require("./sendNotification");

const allAppointments = async () => {
  const appointments = await Appointment.find({});
  return appointments;
};

const appointmentsByUserId = async (_, { userId }) => {
  const appointments = await Appointment.find({
    $or: [{ carerId: userId }, { patientId: userId }],
  });
  return appointments;
};

const appointmentsByDateAndUserId = async (_, { userId, dateInput }) => {
  const appointments = await Appointment.find({
    $and: [
      { $or: [{ carerId: userId }, { patientId: userId }] },
      {
        appointmentDate: {
          $gte: new Date(dateInput.dayStart),
          $lte: new Date(dateInput.dayEnd),
        },
      },
    ],
  }).sort("start");
  return appointments;
};

const createAppointment = async (_, { appointmentInput }) => {
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
      id: _id,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to create appointment | ${error.message}`);

    throw new ApolloError("Failed to create appointment");
  }
};

const deleteAppointment = async (_, { appointmentId }) => {
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
};

const updateAppointment = async (
  _,
  { appointmentId, trigger, appointmentUpdateInput }
) => {
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
        );
        break;
      case "checkout":
        const actualEnd = new Date();
        updatedAppointment = await Appointment.findOneAndUpdate(
          { _id: appointmentId },
          {
            $set: { actualEnd, status: "completed" },
          },
          {
            new: true,
          }
        );
        //get all appointments for that day
        //find this appointment's position in the array
        //if not the last one, find the next appointment and get the patient id
        //send notification to patient "Your carer is on their way to you" (patientId = receiverId)
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

        //notify previous carer
        const previousCarerNotified = await sendNotification({
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
          receiverType: "carer",
          receiverId: newCarerId,
          notificationType: "Schedule change",
          notificationText:
            "You have been assigned a new appointment in your schedule",
          appointmentId,
        });

        //notify patient of the update
        const patientNotified = await sendNotification({
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
      appointment: updatedAppointment,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to update appointment | ${error.message}`);

    throw new ApolloError("Failed to update appointment");
  }
};

const updateAppointmentReview = async (_, { reviewInput, appointmentId }) => {
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
};

module.exports = {
  allAppointments,
  appointmentsByUserId,
  appointmentsByDateAndUserId,
  createAppointment,
  deleteAppointment,
  updateAppointment,
  updateAppointmentReview,
};
