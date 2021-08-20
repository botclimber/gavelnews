module.exports = (...args) => {
	
	for(var i = 0; i < args.length; i++){ if(!args[i]) return true; } 	
	return false;
};
