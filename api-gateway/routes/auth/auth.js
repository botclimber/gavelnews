const router = require('express').Router();
const jwt = require('jsonwebtoken');



// router.post('/sign-up', (req, res) => {});
router.post('/local-sign-in', (req, res) => {
	
	// user data is supposed to come from db (rethink db)
	const user = {'user_id': 1};
	
	const token = jwt.sign(user, process.env.SECRET);
	res.send(token);
});

// router.post('/google-sign-in', (req, res) => {});

module.exports = router;
