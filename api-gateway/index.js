/*

*/

require('dotenv').config();

const express = require('express');
const app = express();

const servicesRoute = require('./routes/services/services');
const authRoute = require('./routes/auth/auth');

const port = process.env.PORT || 3434; 

app.use(express.json())

app.use('/gate/auth', authRoute);
app.use('/gate', servicesRoute);


app.listen(port, () => {
	console.log('Gateway Server started on port ' + port)
});
