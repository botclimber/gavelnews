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


router.post('/local-sign-up', async (req, res) => {
	
	// validate if empty fields
	if (await empty(req.body.name, req.body.email, req.body.password, req.body.user_type)) 
		return res.send({status:false, msg: 'required fields not complete'});
		
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
	await r.table("login").filter({email: user.email}).count().run(con).then( result => {
		if(result) res.send({status:false, msg:'Email already registed'});	
		else{
		
			r.table('login').insert(user).run(con, function(err, result) {
				if (err) throw err;
				console.log(JSON.stringify(result, null, 2));

			}).then(() => {res.send({status: true ,msg: 'user successfuly registed!'})} )
		}	
	}); 
});

router.post('/local-sign-in', async (req, res) => {
	
	const user = await r.table('login').filter({email: req.body.email}).run(con).then( cursor => cursor.toArray());
	
	// verify if email exists	
	if(user[0]){ 
		
		// verify if its duplicated, case true its supposed to trigger some security mechanism
		if(user.length == 1) {
			
			// check if password matches
			if(crypt.check(req.body.password, user[0].password)){
				
				// send token with user data 			
				const token = jwt.sign(user[0], process.env.SECRET);
				res.send(token);

			}else res.send({status: false,  msg: 'wrong password'})
		}else res.send({status: false, msg: 'duplicated data'});	
	
	}else res.send({status: false, msg:'email not registed'})	
});

/**

google auth as possibility (study on disadvantages)
router.post('/google-sign-in', (req, res) => {});
*/

module.exports = router;
