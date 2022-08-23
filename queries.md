# social-network-graphql

## Queries

Request URL: `http://localhost:4000`
Query type: `POST`
Query & Variables location: Body > GraphQL

Query all users

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

Query for user by ID:

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

Query all appointments

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

Query for dashboard

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

Query for matching patients - by carer sex only, or by carer sex and day of week

```graphql
query FindPatientsByCarerSex($userId: ID!) {
  findPatientsByCarerSex(userId: $userId) {
      userId {
          id
          firstName
          lastName
          email
      }
      sex
      postcode
      days
      notificationCount
      appointmentCount
    }
```

variables

```json
{
  "userId": "{{carerId}}"
}
```

```graphql
query FindPatientsByCarerSexAndDay($userId: ID!, $dayInput: DayInput) {
  findPatientsByCarerSexAndDay(userId: $userId, dayInput: $dayInput) {
    userId {
      id
      firstName
      lastName
      email
    }
    sex
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
