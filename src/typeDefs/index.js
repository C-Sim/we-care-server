const { gql } = require("apollo-server");

const typeDefs = gql`
  type Address {
    _id: ID!
    formatted_address: [String]
    thoroughfare: String
    building_name: String
    sub_building_name: String
    sub_building_number: String
    building_number: String
    line_1: String
    line_2: String
    line_3: String
    line_4: String
    locality: String
    town_or_city: String
    county: String
    district: String
    country: String
    fullAddress: String
  }

  type AddressLookup {
    postcode: String
    latitude: String
    longitude: String
    addresses: [Address]
  }

  type Appointment {
    id: ID!
    appointmentDate: String
    title: String
    patientId: User
    carerId: User
    start: String!
    end: String!
    status: String
    actualStart: String
    actualEnd: String
    carerNotes: [String]
    patientNotes: [String]
  }
  type Notification {
    id: ID!
    notificationDate: String!
    senderId: User
    receiverId: String
    notificationType: String
    notificationText: String
    isRead: Boolean
    appointmentId: String
    appointmentDate: String
    patientUsername: String
  }

  type User {
    id: ID!
    firstName: String
    lastName: String
    imageUrl: String
    email: String!
    accountType: String!
    phoneNumber: String
    carerProfileId: Carer
    patientProfileId: Patient
    address: Address
    postcode: String
  }

  type Carer {
    userId: User
    username: String!
    days: [String!]
    appointments: [Appointment]
    notificationCount: String
    appointmentCount: String
    gender: String!
  }

  type AvailablePerson {
    userId: String
    username: String!
    days: [String]
    appointments: [Appointment]
    gender: String
  }

  type Patient {
    userId: User
    username: String!
    days: [String!]
    appointments: [Appointment]
    notificationCount: String
    appointmentCount: String
    gender: String!
    genderPreference: String
  }

  type UserInfo {
    user: User
    carer: Carer
    patient: Patient
  }

  type carerDashboard {
    carer: Carer
    appointments: [Appointment]
    notifications: [Notification]
  }

  type patientDashboard {
    patient: Patient
    appointments: [Appointment]
    notifications: [Notification]
  }

  type DeleteSuccess {
    success: Boolean!
    carerId: String
    patientId: String
  }
  type CreateSuccess {
    success: Boolean!
  }
  type UpdateSuccess {
    success: Boolean!
    userId: String
  }
  type UpdateUserSuccess {
    success: Boolean!
    user: User
  }

  type UpdateAppointmentSuccess {
    success: Boolean!
  }

  type PatientSignupSuccess {
    success: Boolean!
  }

  type CarerSignupSuccess {
    success: Boolean!
  }

  type LoginSuccess {
    success: Boolean!
    token: String!
    user: User
  }

  input AppointmentUpdateInput {
    carerId: String
    start: String
    end: String
    actualStart: String
    actualEnd: String
    note: String
  }
  input AppointmentInput {
    patientId: String!
    carerId: String!
    start: String
    end: String
    appointmentDate: String
    title: String
  }

  input ReviewInput {
    score: Float
    comment: String
    patientId: ID
    appointmentId: ID
    carerId: ID
  }

  input CarePlanInput {
    disabilities: String
    mobility: String
    communication: String
    allergies: String
    personalCare: String
    mentalHealth: String
    dietaryRequirements: String
    designatedPerson: String
  }

  input UserInfoInput {
    postcode: String
    address: ID
    phoneNumber: String
    firstName: String
    lastName: String
    email: String
  }

  input CarerInfoInput {
    gender: String
    days: [String]
  }

  input PatientInfoInput {
    gender: String
    genderPreference: String
    days: [String]
  }

  input SignupInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phoneNumber: String
    accountType: String
    address: ID
    postcode: String!
  }

  input PatientInput {
    gender: String!
    genderPreference: String!
    username: String
    days: [String]
  }

  input CarerInput {
    gender: String!
    username: String
    days: [String]
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input DateInput {
    dayStart: String
    dayEnd: String
  }

  type Query {
    addressLookup(postcode: String!): AddressLookup
    carers: [Carer]
    patients: [Patient]
    availableCarersByDate(selectedDate: String!): [AvailablePerson]
    appointmentsById(userId: ID!): [Appointment]
    appointmentsByUserId: [Appointment]
    appointmentNotesByUserId(userId: ID!): [Appointment]
    appointmentsForNextWorkingDay: [Appointment]
    appointmentsByDateAndUserId(
      userId: ID!
      dateInput: DateInput
    ): [Appointment]
    notificationsByUserId: [Notification]
    userInfo: User
    carerInfo: Carer
    patientInfo(userId: ID!): Patient
    supervisor: User
    carerDashboard: carerDashboard
    patientDashboard: patientDashboard
    availablePatientsByCarerGenderAndDay(
      userId: ID!
      selectedDate: String!
    ): [AvailablePerson]
    findPatientsByCarerGender(userId: ID!): [Patient]
    allNotifications: [Notification]
  }
  type Mutation {
    login(loginInput: LoginInput!): LoginSuccess
    updateUserInfo(updateInput: UserInfoInput): UpdateUserSuccess
    updateCarerInfo(updateCarerInput: CarerInfoInput): UpdateSuccess
    updatePatientInfo(updatePatientInput: PatientInfoInput): UpdateSuccess
    updateApprovedStatus(userId: ID!): UpdateSuccess
    updateCarerReviews(reviewInput: ReviewInput): UpdateSuccess
    createAppointment(appointmentInput: AppointmentInput!): CreateSuccess
    createAppointments(appointments: [AppointmentInput]!): CreateSuccess
    deleteAppointment(appointmentId: ID!): DeleteSuccess
    updateAppointment(
      appointmentId: ID!
      trigger: String!
      appointmentUpdateInput: AppointmentUpdateInput
    ): UpdateAppointmentSuccess
    updateAppointmentReview(
      reviewInput: ReviewInput
      appointmentId: ID!
    ): UpdateSuccess
    updateIsReadStatus(notificationId: ID!): [Notification]

    patientSignup(
      signupInput: SignupInput!
      patientInput: PatientInput!
    ): PatientSignupSuccess
    carerSignup(
      signupInput: SignupInput!
      carerInput: CarerInput!
    ): CarerSignupSuccess
    createCarePlan(carePlanInput: CarePlanInput!): CreateSuccess
  }
`;

module.exports = typeDefs;
