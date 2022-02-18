const express = require('express');
const mongoose = require('mongoose');

const userRoute = require('./routes/user');

const app = express();
mongoose.connect(process.env.DATABASE_URI);
app.use(express.json());

app.use(userRoute);

app.listen(process.env.PORT, () => console.log(`Server is running on port: ${process.env.PORT}`));