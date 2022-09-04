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
    patientId: String!
    carerId: String
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
    senderId: String
    receiverId: String
    notificationType: String
    notificationText: String
    isRead: Boolean
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    accountType: String!
    phoneNumber: String
  }

  type Carer {
    userId: User
    username: String!
    postcode: String!
    days: [String!]
    notificationCount: String
    appointmentCount: String
    gender: String!
  }

  type Patient {
    userId: User
    username: String!
    postcode: String!
    days: [String!]
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
    id: String
  }
  type UpdateSuccess {
    success: Boolean!
    userId: String
  }

  type UpdateAppointmentSuccess {
    success: Boolean!
    appointment: Appointment
  }

  type PatientSignupSuccess {
    success: Boolean!
    user: User
    patient: Patient
    userId: String
  }

  type CarerSignupSuccess {
    success: Boolean!
    user: User
    carer: Carer
    userId: String
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

  input CarerInfoInput {
    gender: String
    postcode: String
    days: [String]
    address: ID
  }

  input PatientInfoInput {
    gender: String
    genderPreference: String
    postcode: String
    days: [String]
    address: ID
  }

  input SignupInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    phoneNumber: String
    accountType: String
  }

  input PatientInput {
    gender: String!
    genderPreference: String!
    username: String
    postcode: String!
    days: [String]
    address: ID
  }

  input CarerInput {
    gender: String!
    username: String
    postcode: String!
    days: [String]
    address: ID
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input DayInput {
    date: String
  }

  input DateInput {
    dayStart: String
    dayEnd: String
  }

  type Query {
    addressLookup(postcode: String!): AddressLookup
    users: [User]
    carers: [Carer]
    patients: [Patient]
    allAppointments: [Appointment]
    appointmentsByUserId(userId: ID!): [Appointment]
    appointmentsByDateAndUserId(
      userId: ID!
      dateInput: DateInput
    ): [Appointment]
    notificationsByUserId(userId: ID!, mailType: String!): [Notification]
    carerInfo(userId: ID!): Carer
    patientInfo(userId: ID!): Patient
    supervisor(accountType: String!): User
    carerDashboard(userId: ID!): carerDashboard
    patientDashboard(userId: ID!): patientDashboard
    findPatientsByCarerGenderAndDay(userId: ID!, dayInput: DayInput): [Patient]
    findPatientsByCarerGender(userId: ID!): [Patient]
  }
  type Mutation {
    login(loginInput: LoginInput!): LoginSuccess
    updateCarerInfo(userId: ID!, updateInput: CarerInfoInput): UpdateSuccess
    updatePatientInfo(userId: ID!, updateInput: PatientInfoInput): UpdateSuccess
    updateApprovedStatus(userId: ID!): UpdateSuccess
    updateCarerReviews(userId: ID!, reviewInput: ReviewInput): UpdateSuccess
    createAppointment(appointmentInput: AppointmentInput!): CreateSuccess
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
    updateIsReadStatus(notificationId: ID!, userId: ID): [Notification]

    patientSignup(
      signupInput: SignupInput!
      patientInput: PatientInput!
    ): PatientSignupSuccess
    carerSignup(
      signupInput: SignupInput!
      carerInput: CarerInput!
    ): CarerSignupSuccess
  }
`;

module.exports = typeDefs;
