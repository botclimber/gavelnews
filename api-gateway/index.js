/*



*/

require('dotenv').config();
const port = process.env.PORT || 3434; 

const hpp = require('hpp');
const toobusy = require('toobusy-js');
const helmet = require('helmet');
const express = require('express');
const app = express();

const servicesRoute = require('./routes/services/services');
const authRoute = require('./routes/auth/auth');

app.use(helmet());
app.use((req, res, next) => {
	if(toobusy()){
		// log (...)
		res.status(503).json()('Server too busy');
	}else next();
});
app.use(express.json())
app.use(hpp());


app.use('/gate/auth', authRoute);
app.use('/gate/services', servicesRoute);


app.listen(port, () => {
	console.log('Gateway Server started on port ' + port)
});
