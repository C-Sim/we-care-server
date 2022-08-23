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
    senderId: String!
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
  }

  type Carer {
    userId: User
    postcode: String!
    days: [String!]
    notificationCount: String!
    appointmentCount: String!
    sex: String!
  }

  type Patient {
    userId: User
    postcode: String!
    days: [String!]
    notificationCount: String!
    appointmentCount: String!
    sex: String!
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

  type SignupSuccess {
    success: Boolean!
    user: User
  }

  type LoginSuccess {
    success: Boolean!
    token: String!
    user: User
  }

  input SignupInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    days: String!
    address: ID!
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
    appointments: [Appointment]
    userInfo(userId: ID!): User
    carerDashboard(userId: ID!): carerDashboard
    patientDashboard(userId: ID!): patientDashboard
    findPatientsByCarerSexAndDay(userId: ID!, dayInput: DayInput): [Patient]
    findPatientsByCarerSex(userId: ID!): [Patient]
  }
  type Mutation {
    login(loginInput: LoginInput!): LoginSuccess
    signup(signupInput: SignupInput!): SignupSuccess
  }
`;

module.exports = typeDefs;
