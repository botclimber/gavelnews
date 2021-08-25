/**
- Middleware:
	- control all the requests flow

*/

const express = require('express')
const router = express.Router()
const axios = require('axios')
const services = require('./services.json')
const verifyToken = require('../validations/verifyToken');

/**

- two formats of requests, with and without id
- API services must be listed in the services.json file
- token required only for specific requests

*/
router.all(['/:apiName/:path', '/:apiName/:path/:id'], verifyToken, (req, res) => {
	const service = services.services[req.params.apiName];
	
	if(service){

		if( (service.reqTokenPaths).includes(req.params.path) && req.token.status !== true) res.status(403).json({msg: 'Token required'});
		else{
			const fullUrl = (req.params.id)? service.url+req.params.path+'/'+req.params.id : service.url+req.params.path; 
			
			const resp = axios({
				method: req.method,
				url: fullUrl,
				headers: req.headers,
				data: {'params':req.body,'content': req.token.content}, 
			}).then(response => response.data)
			.catch(err =>{
				err instanceof Error
				console.log(err.message)
				return err.message
			})
			
			resp.then(result => res.send(result))
		}
	}else res.status(404).json({msg:'API not registed'})
		
})

module.exports = router
