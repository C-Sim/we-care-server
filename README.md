# WeCare - Backend server

![WeCare](./wecare.png)

Backend for the WeCare app allowing efficient collaboration between carers and care users.

![MIT](https://img.shields.io/badge/License-MIT-blue)

## Summary of the project and links

This project is about building the backend of a care management platform.

Github repo: [Go to Repo](https://github.com/C-Sim/we-care-server)
Deployed heroku link: [Go to Heroku](https://fathomless-bayou-99698.herokuapp.com/)

## Table of Contents

- [About the Project](#about-the-project)
- [Technologies](#technologies)
- [Main logic of the application](#main-logic-of-the-application)
- [Local Installation](#local-installation)
- [Deployed Application](#deployed-application)
- [Contact the team](#contact-the-team)

## About the project

### User Story

```md
AS A WeCare user who is involved in the provision of care services
I CAN access all my relevant care information digitally, in one place and make live changes
SO THAT the quality of care provision is optimised
```

## Technologies

For this project, the following technologies and packages were used to build the backend :

- Node.js v18.2.0 and NPM v8.9.0
- "@faker-js/faker": "^7.5.0",
- "apollo-server": "^3.10.2",
- "axios": "^0.27.2",
- "bcrypt": "^5.0.1",
- "date-fns": "^2.29.2",
- "dotenv": "^16.0.2",
- "graphql": "^16.6.0",
- "jsonwebtoken": "^8.5.1",
- "mongoose": "^6.5.4"

For testing of the API calls: Postman.
The queries and mutations are compiled in the [queries.md](https://github.com/C-Sim/we-care-server/blob/main/queries.md) file in this repo.

## Main logic of the application

### Database Models

Our database is built in MongoDB with the following collections of documents and their subdocuments:

- Users:
  - Address
- Supervisors
- Carers:
  - Review
- Patients:
  - CarePlan
- AddressLookup
- Appointments:
  - Review
- Notifications

### Associations

Our associations are:

- All users have a `user` profile, and they have a second profile depending on their role: `supervisor`, `carer` or `patient`
- All appointments reference the carer and the patient involved
- All notifications reference the sender and the receiver involved, and when applicable the appointment involved

## Local Installation

Should you wish to get this project installed on your local machine, the following steps are required:

Clone the two repositories:

- https://github.com/C-Sim/we-care-server
- https://github.com/C-Sim/we-care-react

For each repo, go into the new repository and install the required packages:

```
cd {{repo-name}}
npm install
```

Once installed, make sure to set the environment variables as per the .env.sample file.

To create and seed information into a local database, from the root folder, open an integrated terminal and enter the instruction below and press enter:

```
npm run seed
```

You can check your database in MongoDB Compass and should see your database and all the relevant collections.

To start your backend, enter the following command:

```
npm run start
```

Once your server is up and running, you can get the frontend running, and once they are both running, you should be able to use the application as intended.

## Deployed application

Backend deployment: [Heroku](https://floating-river-62141.herokuapp.com/)

Frontend deployment: [Heroku](https://fathomless-bayou-99698.herokuapp.com/)

When accessing the application, the following sample user accounts can be used:

- Log in as a carer: Darien53@example.org
- Log in as a patient: Riley_Lueilwitz@example.org
- Log in as a supervisor: supervisor@example.org

All seed accounts use the password: password123

## Contact the Team

If you have any questions about this application, feel free to get in touch with any member of the team:

- Gurmanpreet Nagra: [Github](https://github.com/Mkn01) - [Portfolio](https://mkn01.github.io/portfolio/)

- Amelie Pira: [Github](https://github.com/Am0031) - [Portfolio](https://am0031.github.io/my-portfolio-react/)

- Cherelle Simpson: [Github](https://github.com/C-Sim) - [Portfolio](https://c-sim.github.io/portfolio-react/)

- Nayan Sharma: [Github](https://github.com/nsharma-uk) - [Portfolio](https://nsharma-uk.github.io/professional-portfolio/)

- JinYi Yu: [Github](https://github.com/jinyiyu) - [Portfolio](https://jinyiyu.github.io/my-personal-protfolio/)
