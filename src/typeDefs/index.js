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
    patientId: String!
    carerId: String
    start: String!
    end: String!
    status: String
    actualStart: String
    actualEnd: String
  }
  type Notification {
    id: ID!
    notificationDate: String!
    senderId: String
    receiverId: String
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
    postcode: String!
    days: [String!]
    notificationCount: String!
    appointmentCount: String!
    gender: String!
  }

  type Patient {
    userId: User
    username: String!
    postcode: String!
    days: [String!]
    notificationCount: String!
    appointmentCount: String!
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

  type CreateSuccess {
    success: Boolean!
    id: String
  }
  type UpdateInfoSuccess {
    success: Boolean!
    userId: String
  }

  type PatientSetupSuccess {
    success: Boolean!
    patient: Patient
    userId: String
  }

  type SignupSuccess {
    success: Boolean!
    user: User
  }

  type LoginSuccess {
    success: Boolean!
    token: String!
    user: User
  }

  input AppointmentInput {
    patientId: String!
    carerId: String!
    start: String
    end: String
    appointmentDate: String
    title: String
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
    accountType: String!
    phoneNumber: String
  }

  input PatientInput {
    userId: String!
    gender: String!
    genderPreference: String!
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

  type Query {
    addressLookup(postcode: String!): AddressLookup
    users: [User]
    carers: [Carer]
    patients: [Patient]
    allAppointments: [Appointment]
    appointmentsByUserId(userId: ID!): [Appointment]
    receivedNotificationsByUserId(userId: ID!): [Notification]
    sentNotificationsByUserId(userId: ID!): [Notification]
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
    signup(signupInput: SignupInput!): SignupSuccess
    patientSetup(patientInput: PatientInput!): PatientSetupSuccess
    updateCarerInfo(userId: ID!, updateInput: CarerInfoInput): UpdateInfoSuccess
    updatePatientInfo(
      userId: ID!
      updateInput: PatientInfoInput
    ): UpdateInfoSuccess
    createAppointment(appointmentInput: AppointmentInput!): CreateSuccess
  }
`;

module.exports = typeDefs;
