# we-care-server - queries and mutations

## Postman setup

Request URL: `http://localhost:4000`
Query type: `POST`
Query & Variables location: Body > GraphQL

## Queries

### Query all users --> not needed for the app

```graphql
query Users {
  users {
    id
    firstName
    lastName
    email
    accountType
  }
}
```

Note: In "Tests" section, create variables `carerId` and `patientId` from the response (for use in subsequent queries)

### Query by ID

#### Query users by ID

```graphql
query UserInfo($userId: ID!) {
  userInfo(userId: $userId) {
    id
    firstName
    lastName
    email
    accountType
  }
}
```

variables

```json
{
  "userId": "{{patientId}}"
}
```

#### Query Carer info by userId

```graphql
query CarerInfo($userId: ID!) {
  carerInfo(userId: $userId) {
    userId {
      id
      firstName
      lastName
      email
      accountType
    }
    postcode
    gender
    days
    notificationCount
    appointmentCount
  }
}
```

variables:

```
{
    "userId": "{{carerId}}"
}
```

#### Query Patient info by userId

```graphql
query PatientInfo($userId: ID!) {
  patientInfo(userId: $userId) {
    userId {
      id
      firstName
      lastName
      email
      accountType
    }
    postcode
    gender
    days
    notificationCount
    appointmentCount
  }
}
```

variables:

```
{
    "userId": "{{patientId}}"
}
```

### Query appointments

#### Query all appointments - not needed for app

```graphql
query Appointments {
  appointments {
    id
    patientId
    carerId
    start
    end
    status
    actualStart
    actualEnd
  }
}
```

#### Query appointments by userId (carer or patient)

```graphql
query AppointmentsByUserId($userId: ID!) {
  appointmentsByUserId(userId: $userId) {
    id
    patientId
    carerId
    start
    end
    status
    actualStart
    actualEnd
  }
}
```

variables:

```
{
    "userId": "{{patientId}}"
}
```

#### Query all past notes from appointments by patientId

Uses the same appointmentsByUserId query but targets different fields for the response

```graphql
query AppointmentNotesByUserId($userId: ID!) {
  appointmentsByUserId(userId: $userId) {
    start
    notes
  }
}
```

variables:

```
{
    "userId": "{{patientId}}"
}
```

### Query notifications

#### Query received notifications by userId

```graphql
query ReceivedNotificationsByUserId($userId: ID!, $mailType: String!) {
  notificationsByUserId(userId: $userId, mailType: $mailType) {
    id
    notificationDate
    senderId
    receiverId
    notificationText
    isRead
  }
}
```

variables:

```json
{
  "userId": "{{patientId}}",
  "mailType": "received"
}
```

#### Query sent notifications by userId

```graphql
query SentNotificationsByUserId($userId: ID!, $mailType: String!) {
  notificationsByUserId(userId: $userId, mailType: $mailType) {
    id
    notificationDate
    senderId
    receiverId
    notificationText
    isRead
  }
}
```

variables:

```json
{
  "userId": "{{carerId}}",
  "mailType": "sent"
}
```

#### Query all notifications by userId

```graphql
query AllNotificationsByUserId($userId: ID!, $mailType: String!) {
  notificationsByUserId(userId: $userId, mailType: $mailType) {
    id
    notificationDate
    senderId
    receiverId
    notificationText
    isRead
  }
}
```

variables:

```json
{
  "userId": "{{carerId}}",
  "mailType": "all"
}
```

### Queries for dashboards

#### Query for carer dashboard

```graphql
query CarerDashboard($userId: ID!) {
  carerDashboard(userId: $userId) {
    carer {
      userId
      postcode
      days
      notificationCount
    }
    appointments {
      id
      patientId
      carerId
      start
      end
      status
      actualStart
      actualEnd
    }
    notifications {
      notificationDate
      receiverId
      senderId
      isRead
      notificationText
    }
  }
}
```

variables

```json
{
  "userId": "{{carerId}}"
}
```

#### Query for patient dashboard

```graphql
query PatientDashboard($userId: ID!) {
  patientDashboard(userId: $userId) {
    patient {
      userId
      postcode
      days
      notificationCount
    }
    appointments {
      id
      patientId
      carerId
      start
      end
      status
      actualStart
      actualEnd
    }
    notifications {
      notificationDate
      receiverId
      senderId
      isRead
      notificationText
    }
  }
}
```

variables

```json
{
  "userId": "{{patientId}}"
}
```

### Queries for supervisor account

#### Query all carers

```graphql
query Carers {
  carers {
    userId {
      id
      firstName
      lastName
      email
      phoneNumber
    }
    postcode
    gender
    days
    notificationCount
    appointmentCount
  }
}
```

#### Query all patients

```graphql
query Patients {
  patients {
    userId {
      id
      firstName
      lastName
      email
      phoneNumber
    }
    postcode
    gender
    genderPreference
    days
    notificationCount
    appointmentCount
  }
}
```

#### Query for matching patients - by carer gender only, or by carer gender and day of week

```graphql
query FindPatientsByCarerGender($userId: ID!) {
  findPatientsByCarerGender(userId: $userId) {
    userId {
      id
      firstName
      lastName
      email
    }
    gender
    genderPreference
    postcode
    days
    notificationCount
    appointmentCount
  }
}
```

variables

```json
{
  "userId": "{{carerId}}"
}
```

```graphql
query FindPatientsByCarerGenderAndDay($userId: ID!, $dayInput: DayInput) {
  findPatientsByCarerGenderAndDay(userId: $userId, dayInput: $dayInput) {
    userId {
      id
      firstName
      lastName
      email
    }
    gender
    postcode
    days
    notificationCount
    appointmentCount
  }
}
```

variables

```json
{
  "userId": "{{carerId}}",
  "dayInput": {
    "date": "2022-09-21T07:00:00.000+00:00"
  }
}
```

## Mutations

### Mutation for signing up as a new user (patient account type)

1st part: mutation to set up the new user (account type: patient - part of signup form)

```graphql
mutation Mutation($signupInput: SignupInput!) {
  signup(signupInput: $signupInput) {
    success
    user {
      id
      firstName
      lastName
      email
    }
  }
}
```

variables:

```json
{
  "signupInput": {
    "firstName": "{{$randomFirstName}}",
    "lastName": "{{$randomLastName}}",
    "email": "{{$randomExampleEmail}}",
    "password": "Password123!",
    "accountType": "patient"
  }
}
```

2nd part: mutation for setting up the new profile (part of signup form):

```graphql
mutation Mutation($patientInput: PatientInput!) {
  patientSetup(patientInput: $patientInput) {
    success
    patient {
      username
    }
    userId
  }
}
```

variables:

```json
{
  "patientInput": {
    "userId": "{{newUserId}}",
    "gender": "female",
    "genderPreference": "none",
    "username": "{{username}}",
    "postcode": "B29 5PZ",
    "days": [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    ]
  }
}
```

### Mutation for logging in (any account type):

```graphql
mutation Mutation($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    success
    token
    user {
      id
      firstName
      lastName
      email
      accountType
    }
  }
}
```

variables:

```json
{
  "loginInput": {
    "email": "{{userEmail}}",
    "password": "Password123!"
  }
}
```

### Mutation for updating profile info

#### Mutation for updating carer profile info

```graphql
mutation UpdateCarerInfo($userId: ID!, $updateInput: CarerInfoInput) {
  updateCarerInfo(userId: $userId, updateInput: $updateInput) {
    success
    userId
  }
}
```

variables (example):

```json
{
  "userId": "{{carerId}}",
  "updateInput": {
    "postcode": "B15 4RT",
    "gender": "female"
  }
}
```

#### Mutation for updating patient profile info

```graphql
mutation UpdatePatientInfo($userId: ID!, $updateInput: PatientInfoInput) {
  updatePatientInfo(userId: $userId, updateInput: $updateInput) {
    success
    userId
  }
}
```

variables (example):

```json
{
  "userId": "{{patientId}}",
  "updateInput": {
    "postcode": "B12 4RT",
    "genderPreference": "female"
  }
}
```

### Mutations for supervisor account

#### Mutation for adding a new carer: new user (account type carer) + new carer profile

Hoping to use the signup mutation (passing it accountType: carer)
Need to confirm if it works after signup mutation is updated

#### Mutation for approving a new patient (update user field approvedStatus)

```graphql
mutation UpdateApprovedStatus($userId: ID!) {
  updateApprovedStatus(userId: $userId) {
    success
    userId
  }
}
```

variables:

```
{
    "userId": "{{nonApprovedUserId}}"
}
```

#### Mutation for creating an appointment

```graphql
mutation CreateAppointment($appointmentInput: AppointmentInput!) {
  createAppointment(appointmentInput: $appointmentInput) {
    success
    id
  }
}
```

variables:

```json
{
  "appointmentInput": {
    "carerId": "{{carerId}}",
    "patientId": "{{patientId}}",
    "start": "2022-09-22T16:00:00.000+00:00",
    "end": "2022-09-22T17:00:00.000+00:00",
    "appointmentDate": "2022-09-22T16:00:00.000+00:00",
    "title": "New appointment"
  }
}
```

#### Mutation for deleting an appointment

```graphql
mutation DeleteAppointment($appointmentId: ID!) {
  deleteAppointment(appointmentId: $appointmentId) {
    success
    carerId
    patientId
  }
}
```

variables:

```json
{
  "appointmentId": "{{appointmentId}}"
}
```

#### Mutation for reallocating an appointment by appointmentId (update carerId)

Uses the `updateAppointment` resolver function with switch case trigger = "carerChange"

```graphql
mutation UpdateAppointmentCarer(
  $appointmentId: ID!
  $trigger: String!
  $appointmentUpdateInput: AppointmentUpdateInput
) {
  updateAppointment(
    appointmentId: $appointmentId
    trigger: $trigger
    appointmentUpdateInput: $appointmentUpdateInput
  ) {
    success
    appointment {
      id
      carerId
    }
  }
}
```

variables:

```json
{
  "appointmentId": "{{appointmentId}}",
  "trigger": "carerChange",
  "appointmentUpdateInput": {
    "carerId": "{{alternativeCarerId}}",
    "start": "2022-09-22T19:00:00.000+00:00",
    "end": "2022-09-22T20:00:00.000+00:00"
  }
}
```

### Mutations for appointments

#### Mutation for checking in (carer - actual start time of an appointment)

Uses the `updateAppointment` resolver function with switch case trigger = "checkin"

```graphql
mutation UpdateAppointmentCheckin(
  $appointmentId: ID!
  $trigger: String!
  $appointmentUpdateInput: AppointmentUpdateInput
) {
  updateAppointment(
    appointmentId: $appointmentId
    trigger: $trigger
    appointmentUpdateInput: $appointmentUpdateInput
  ) {
    success
    appointment {
      id
      start
      actualStart
      status
    }
  }
}
```

variables:

```json
{
  "appointmentId": "{{appointmentId}}",
  "trigger": "checkin"
}
```

#### Mutation for checking out (carer - actual end time of an appointment)

Uses the `updateAppointment` resolver function with switch case trigger = "checkout"

```graphql
mutation UpdateAppointmentCheckout(
  $appointmentId: ID!
  $trigger: String!
  $appointmentUpdateInput: AppointmentUpdateInput
) {
  updateAppointment(
    appointmentId: $appointmentId
    trigger: $trigger
    appointmentUpdateInput: $appointmentUpdateInput
  ) {
    success
    appointment {
      id
      end
      actualEnd
      status
    }
  }
}
```

variables:

```json
{
  "appointmentId": "{{appointmentId}}",
  "trigger": "checkout"
}
```

#### Mutation for adding a patient note to appointment

Uses the `updateAppointment` resolver function with switch case trigger = "patientNote"

```graphql
mutation UpdateAppointmentPatientNote(
  $appointmentId: ID!
  $trigger: String!
  $appointmentUpdateInput: AppointmentUpdateInput
) {
  updateAppointment(
    appointmentId: $appointmentId
    trigger: $trigger
    appointmentUpdateInput: $appointmentUpdateInput
  ) {
    success
    appointment {
      id
      patientNotes
    }
  }
}
```

variables:

```json
{
  "appointmentId": "{{appointmentId}}",
  "trigger": "patientNote",
  "appointmentUpdateInput": {
    "note": "{{$randomLoremSentence}}"
  }
}
```

#### Mutation for adding a carer note to appointment

Uses the `updateAppointment` resolver function with switch case trigger = "carerNote"

```graphql
mutation UpdateAppointmentCarerNote(
  $appointmentId: ID!
  $trigger: String!
  $appointmentUpdateInput: AppointmentUpdateInput
) {
  updateAppointment(
    appointmentId: $appointmentId
    trigger: $trigger
    appointmentUpdateInput: $appointmentUpdateInput
  ) {
    success
    appointment {
      id
      carerNotes
    }
  }
}
```

variables:

```json
{
  "appointmentId": "{{appointmentId}}",
  "trigger": "carerNote",
  "appointmentUpdateInput": {
    "note": "{{$randomLoremSentence}}"
  }
}
```

### Mutation for adding carer review

### Mutations for notifications

#### Mutations for creating a notification

To be added as part of each action that triggers a notification (for clarity of who is the sender/receiver)

#### Mutation for updating notification status by notification id

Updates the `isRead` status when the receiver opens the notification

```graphql
mutation UpdateIsReadStatus($notificationId: ID!, $userId: ID) {
  updateIsReadStatus(notificationId: $notificationId, userId: $userId) {
    success
    userId
  }
}
```

variables:

```json
{
  "userId": "6311f2d9c3dd8bb84a9377aa",
  "notificationId": "6311f2dcc3dd8bb84a937b55"
}
```
