const express = require('express')
const app = express()
const userRouter = require('./router/userRouter');
const port = 3000
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
dotenv.config();
db()

//------------------ user ----------------------
app.use('/user', userRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


