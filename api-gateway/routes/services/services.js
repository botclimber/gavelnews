
const express = require('express')
const router = express.Router()
const axios = require('axios')
const services = require('./services.json')
const verifyToken = require('../validations/verifyToken');

router.all(['/:apiName/:path', '/:apiName/:path/:id'], verifyToken, (req, res) => {
	const service = services.services[req.params.apiName];
	
	if(service){

		if( (service.reqTokenPaths).includes(req.params.path) && req.token.status !== true) res.send('Token required');
		else{
			const fullUrl = (req.params.id)? service.url+req.params.path+'/'+req.params.id : service.url+req.params.path; 
			
			const resp = axios({
				method: req.method,
				url: fullUrl,
				headers: req.headers,
				params: {"params": req.body, "user_data": req.token.content}, 
			}).then(response => response.data)
			.catch(err =>{
				err instanceof Error
				console.log(err.message)
				return err.message
			})
			
			resp.then(result => res.send(result))
		}
	}else res.send('API not registed')

})

module.exports = router
