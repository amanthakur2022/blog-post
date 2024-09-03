const express = require('express');
const connectToDb = require('./config/connectTodb');
const dotenv = require('dotenv');
const Auth = require('./routes/Auth.route');
dotenv.config();

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/', Auth);
connectToDb();

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port http://localhost:${process.env.PORT}`);
});
