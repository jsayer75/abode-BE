# Abode Test - BE
## Description
This repository contains the backend part of a proof-of-concept (PoC) software system for a simple yet effective calendar event management system. It is built using NestJS with Redis for the back-end API. The system enables CRUD operations for events and incorporates a notification system to alert invitees before the event starts.

## Prerequisites
- Node.js - Ensure you have Node.js installed. If not, you can download it from [here](https://nodejs.org/en).
- Redis - To run the notification system, you'll need to have Redis installed. You can download and install Redis from [here](https://redis.io/download/).
- MongoDB - If you want to run MongoDB locally, you'll need to install it. You can download MongoDB from [here](https://www.mongodb.com/try/download/community).

## Installation

```bash
$ npm install
```
## Setting Up Environment Variables
- **Copy .env.example**: Duplicate the .env.example file in the root of your project.
- **Rename the File**: Remove the .example extension from the duplicated file so that it becomes .env.
- **Add Your Values**: Open the .env file in a text editor and fill in the required values for your MongoDB connection string and JWT token.
- **Save the File**: Save the .env file with your changes.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## Design Choices and Future Considerations

- **NestJS**: A complete framework that provides a clear and defined structure for developing applications. It follows an MVC-like architecture, making it easier to organize code and separate concerns. NestJS is built on top of Node.js, which is known for its performance and scalability.
- **MongoDB**: A NoSQL database that offers a flexible schema, scalability, and performance. MongoDB's document-based structure and rich query language make it easy to work with data.
- **Mongoose**: A schema-based solution for modeling application data. Mongoose provides schema validation, middleware, query builders, population, and plugins.
- **Bull.js**: A powerful job queue library for Node.js. It provides a robust job queue, reliability, scalability, monitoring, and UI. Bull.js integrates seamlessly with NestJS, allowing for easy creation and management of job queues.

#### What would I have done with more time
- **User Authentication and Authorization**: Implementing user authentication and authorization using a library like Passport.js could add an extra layer of security to the application. Instead of sending the access token in the response body, I prefer to send it in an HTTP-only cookie. This approach enhances security by preventing malicious scripts from accessing the token through JavaScript.
- **Enhanced Notification System**: The current notification system is a basic email simulation. With more time, I could integrate a more robust notification service, such as Twilio for SMS notifications or use SendGrid for email. Alternatively, we could explore using Firebase to send push notifications directly to the frontend. However, before implementing this, we would need to save the machine token in the database along with the access token or user ID, depending on the case. Additionally, if a user logs out, we should delete that token from the database as well.
- **Advanced Event Management Features**: Implementing features such as recurring events and event categories could enhance the functionality of the application.
- **Refactoring the Implementation of Bull.js Queue**: Currently, I am saving every event into the queue with some delay, and the queue uses Redis, which is fast but uses the primary memory of the server. For a few events, this approach is not bad, but if a system has many events, this approach is not suitable. To improve this, we can run a cron job every 6 hours to fetch all events that will start in the next 6 hours. We can then add these events to our queue. Alternatively, we can use a separate small server to manage notifications. Since we are using NestJS, we can create microservices easily and communicate with them using the gRPC protocol to maintain synchronization.
- **updating technique of Bull.js Queue**: Currently, I am removing a job and adding a new job. While there is a method in Bull.js to update a job, when I change its delay time, the job is not executing as expected. I would like to work on improving this implementation.


