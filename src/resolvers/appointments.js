const { ApolloError } = require("apollo-server");
const { Appointment, Supervisor, Carer, Patient } = require("../models");

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

module.exports = {
  allAppointments,
  appointmentsByUserId,
  createAppointment,
  deleteAppointment,
};
