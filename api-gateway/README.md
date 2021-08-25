# API Gateway (GavelNews)
API to be the middleware between front-end applications and services. Also handle the auth&authz functionalities.

## Request Formats
In order to request authentication or services here the 2 possible formats (usually PORT = 3000 || 3434):

- Auth
	- (host):3000/gate/auth/local-sign-up
		- params: ['name','email','password']
	- (host):3000/gate/auth/local-sign-in
		- params: ['email','password']

- Services
	- (host):3000/gate/services/:apiName/:path
	- (host):3000/gate/services/:apiName/:path/:id

## Code
Here's the two routes u can request:

```js
// authentication functionality
app.use('/gate/auth', authRoute);

// API services request functionality 
app.use('/gate/services', servicesRoute);
```

## Services regist
In order to the API Gateway use other services they must be registed in the [services.json](https://github.com/botclimber/gavelnews/tree/main/api-gateway/routes/services/services.json) file.

Regist file format:
```json 
{
"services": {

	"apiName": {
		"apiName": "", 
		"host": "",
		"port": ,
		"url": "",
		"reqTokenPaths": []
		}	
	}
}
```

reqTokenPaths is every path where u must include a token. There are some requests available for all sources, but some request some kind of authorization, to do so we send a token containing info about whos requestin it.
