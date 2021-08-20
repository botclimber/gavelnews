const express = require('express')
const app = express()
const port = 5001 


app.get('/home', (req, res) => {
  res.send('testAPI says: its lit')
})

app.get('/create', (req, res) => {
  res.send('testAPI says: 21 21')
})

app.get('/home/:id', (req, res) => {
  res.send('testAPI says: its lit and id = ' + req.params.id+' \n')
})

app.listen(port, () => {
  console.log('testAPI server up and runnning (PORT:'+port+' )')
})
