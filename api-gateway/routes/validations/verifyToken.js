const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
	const token = req.header('auth-token');
	if (!token) console.log({'status': 'warning', 'msg': 'token not provided'});

	try {
		const content = jwt.verify(token, process.env.SECRET);
		req.token= {'status': true, 'content': content};

	}catch{
		req.token = {'status': false, 'content': null};
	}
	
	next();
};
