const router = require('express').Router();
const jwt = require('jsonwebtoken');
const r = require('rethinkdb');
const crypt = require('p4ssw0rd');
const empty = require('../validations/chkIfEmpty');

var con = null; 
r.connect( {host: process.env.DB_HOST, port: process.env.DB_PORT, db: process.env.DB_NAME}, function(err, conn) {
    if (err) throw err;
    con = conn;
})

router.post('/sign-up', async (req, res) => {
	
	// validate if empty fields
	if (await empty(req.body.name, req.body.email, req.body.password, req.body.user_type)) 
		return res.send('required fields not complete');
		

	// hash password	
	const hash = await crypt.hash(req.body.password);
	const user = {
		name: req.body.name,
		email: req.body.email,
		verified_email: false,
		password: hash,
		user_type: req.body.user_type,
		date: new Date()
	};

	// verify if email already exists
	return await r.table("login").filter({email: user.email}).count().run(con).then( result => {
		if(result) res.send('Email already registed');	

	}); 

	await r.table('login').insert(user).run(con, function(err, result) {
		if (err) throw err;
	    	console.log(JSON.stringify(result, null, 2));

	}).then(() => {res.send('success')} )
		
});

router.post('/local-sign-in', (req, res) => {
	
	// user data is supposed to come from db (rethink db)
	const user = {'user_id': 1};
	
	const token = jwt.sign(user, process.env.SECRET);
	res.send(token);
});

/**

google auth as possibility (study on disadvantages)
router.post('/google-sign-in', (req, res) => {});
*/

module.exports = router;
