const express = require('express');
const mongoose = require('mongoose');

const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const commentRoute = require('./routes/comment');
const likeRoute = require('./routes/like');

const app = express();
mongoose.connect(process.env.DATABASE_URI);
app.use(express.json());

app.use(userRoute);
app.use(postRoute);
app.use(commentRoute);
app.use(likeRoute);

app.listen(process.env.PORT, () => console.log(`Server is running on port: ${process.env.PORT}`));