
require('dotenv').config();

const express = require('express')
const app = express()
const routes = require('./routes')

const port = process.env.PORT || 3434 

app.use(express.json())

app.use('/', routes)

app.listen(port, () => {
	console.log('Gateway Server started on port ' + port)
})
