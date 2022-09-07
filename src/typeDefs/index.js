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
    senderId: String
    receiverId: String
    notificationType: String
    notificationText: String
    isRead: Boolean
  }

  type User {
    id: ID!
    firstName: String
    lastName: String
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
    notificationCount: String
    appointmentCount: String
    gender: String!
  }

  type Patient {
    userId: User
    username: String!
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
    updateUserInfo(userId: ID!, updateInput: UserInfoInput): UpdateSuccess
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
    createCarePlan(userId: ID!, carePlanInput: CarePlanInput!): CreateSuccess
  }
`;

module.exports = typeDefs;
