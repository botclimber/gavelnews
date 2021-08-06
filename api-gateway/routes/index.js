
const express = require('express')
const router = express.Router()
const axios = require('axios')
const services = require('./services.json')

router.all(['/:apiName/:path', '/:apiName/:path/:id'], (req, res) => {
	
	if(services.services[req.params.apiName]){

		const fullUrl = (req.params.id)? services.services[req.params.apiName].url+req.params.path+'/'+req.params.id : services.services[req.params.apiName].url+req.params.path; 
	
		const resp = axios({
			method: req.method,
			url: fullUrl,
			headers: req.headers,
			data: req.body
		}).then(response => response.data)
		.catch(err =>{
			err instanceof Error
			console.log(err.message)
			return err.message
		})
		
		resp.then(result => res.send(result))
	
	}else{
		res.send('API not registed')
	}

})

module.exports = router
