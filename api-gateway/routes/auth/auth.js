const bouncer = require('express-bouncer')(500, 600000, 5);
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const r = require('rethinkdb');
const crypt = require('p4ssw0rd');
const empty = require('../validations/chkIfEmpty');

//bouncer.whitelist.push("127.0.0.1");
bouncer.blocked = (req, res, next, remainig) => {
    res.status(429).json("Too many requests have been made, " + "please wait " + remaining / 1000 + " seconds");
};

var con = null; 
r.connect( {host: process.env.DB_HOST, port: process.env.DB_PORT, db: process.env.DB_NAME}, function(err, conn) {
    if (err) throw err;
    con = conn;
})

/**

- feature: when successfully signed-up response must return also a token in order
to the user be redirect to the users initial page;
(not implemented)

*/
router.post('/local-sign-up', async (req, res) => {
	
	// validate if empty fields
	if (await empty(req.body.name, req.body.email, req.body.password, req.body.user_type)) 
		return res.status(400).json({msg: 'required fields not complete'});
	
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
		if(result) res.status(400).json({msg:'Email already registed'});	
		else{
		
			r.table('login').insert(user).run(con, function(err, result) {
				if (err) throw err;
				console.log(JSON.stringify(result, null, 2));

			}).then(() => {res.status(200).json({msg: 'user successfuly registed!'})} )
		}	
	}); 
});

router.post('/local-sign-in', bouncer.blocked, async (req, res) => {
	
	// validate if empty fields
	if (await empty(req.body.email, req.body.password)) 
		return res.status(400).json({msg: 'required fields not complete'});
	
	const user = await r.table('login').filter({email: req.body.email}).run(con).then( cursor => cursor.toArray());
	
	// verify if email exists	
	if(user[0]){ 
		
		// verify if its duplicated, case true its supposed to trigger some security mechanism
		if(user.length == 1) {
			
			// check if password matches
			if(crypt.check(req.body.password, user[0].password)){
				bouncer.reset(req);
							
				// send token with user data 			
				const token = jwt.sign(user[0], process.env.SECRET);
				res.status(200).json({'token': token});

			}else res.status(400).json({msg: 'wrong password'})
		}else res.status(400).json({msg: 'duplicated email'});	
	}else res.status(400).json({msg:'email not registed'})	
});

/**

google auth as possibility (study on disadvantages)
router.post('/google-sign-in', (req, res) => {});
*/

module.exports = router;
