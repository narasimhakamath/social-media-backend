# Social Media Application

This is a complete backend only application built using ExpressJS for managing the requests/resposes, MongoDB as the data storage by using MongooseJS as the ODM, and JWT as the way of authenticating the protected routes.

## Installation

To use the application in your local machine, take the latest pull and install the necessary dependency packages used in this project.

```bash
npm install
```

## Environment Variables

This project makes use of environment variables so as to maintain better security and easier configurations between production/staging/local system. 

```bash
PORT=3000
DATABASE_URI=mongodb://127.0.0.1:27017/socialmedia
JWT_SECRET=socialmediaapplication
```

## Documentation
The APIs are documented on [Postman](https://documenter.getpostman.com/view/6656850/UVkjwJLQ).

## Contributing
This is a web application built as an assessment test for an interview. Please raise an issue if you find any as code changes/pull-requests will not be looked into as this repository will be made private soon.