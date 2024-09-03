const express = require('express');
const connectToDb = require('./config/connectTodb');
const dotenv = require('dotenv');
const Auth = require('./routes/Auth.route');
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/', Auth);
connectToDb();

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port http://localhost:${process.env.PORT}`);
});
