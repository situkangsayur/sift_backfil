/*
 * GET home page.
 */

var validate = require('jsonschema').validator;

exports.index = function(req, res) {
	console.log(validate(4, {
		'type' : 'number'
	}));
	res.render('index', {
		title : 'Express'
	});
};