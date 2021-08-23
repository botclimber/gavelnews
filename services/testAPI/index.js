const express = require('express')
const app = express()
const port = 5001 

app.use(express.json())

// token not required req 
app.get('/home', (req, res) => {
  res.status(200).json('for this life i can not change')
})

// token not required req 
app.get('/home/:id', (req, res) => {
  res.status(200).json('testAPI says: its lit and id = ' + req.params.id+' \n')
})

// token required req 
app.get('/secrets', (req, res) => {
  res.status(200).json('stop trying be god')
})

// token required post req 
app.post('/createPost/', (req, res) => {
	
	console.log(req.body)	
	res.status(200).json('look alive')
})

// token required delete req
app.delete('/delPost/:id', (req, res) => {
	
	if(!req.params.id) res.status(400).json('send what u want to delete')
	res.status(200).json('del request received')
})

// token required put req
app.put('/updatePost/:id', (req, res) => {
	
	if(!req.params.id) res.status(400).json('send what u want to update')
	res.status(200).json('update request received')
})

app.listen(port, () => {
  console.log('testAPI server up and runnning (PORT:'+port+' )')
})
