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

#### Query Carer by userId:

#### Query Patient by userId:

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

### Query notifications

#### Query received notifications by userId

```graphql
query ReceivedNotificationsByUserId($userId: ID!) {
  receivedNotificationsByUserId(userId: $userId) {
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

```
{
    "userId": "{{patientId}}"
}
```

#### Query sent notifications by userId

#### Query all notifications by userId

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

#### Mutation for updating patient profile info

### Mutations for supervisor account

#### Mutation for adding a new carer: new user (account type carer) + new carer profile

#### Mutation for approving a patient

#### Mutation for creating an appointment

#### Mutation for deleting an appointment

#### Mutation for updating appointments by userId (adding extra appointment)

### Mutations for appointments

#### Mutation for checking in (carer - actual start time of an appointment)

#### Mutation for checking out (carer - actual end time of an appointment)

#### Mutation for adding review/notes/comment to appointment

### Mutation for adding carer review

### Mutations for notifications

#### Mutations for creating a notification

#### Mutation for updating notification status by userId and notification id

```

```
