require('dotenv').config();
const port = process.env.PORT || 3434; 

const hpp = require('hpp');
const toobusy = require('toobusy-js');
const helmet = require('helmet');
const express = require('express');
const app = express();

const servicesRoute = require('./routes/services/services');
const authRoute = require('./routes/auth/auth');

// some security
app.use(helmet());

// warning case server overloaded
app.use((req, res, next) => {
	if(toobusy()){
		// log (...)
		res.status(503).json()('Server too busy');
	}else next();
});

// use json expressions
app.use(express.json())

// clean body params
app.use(hpp());

// authentication functionality
app.use('/gate/auth', authRoute);

// API services request functionality 
app.use('/gate/services', servicesRoute);


app.listen(port, () => {
	console.log('Gateway Server started on port ' + port)
});
