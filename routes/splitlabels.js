var reqSend = require('./../request_sender'), struct = require('./../data_structure'), config = require('./../sift_data');

mongoDataEnt = struct.mongoDataEnt;
data = struct.data;
mongoDataUser = struct.mongoDataUser;
mongoDataLabel = struct.mongoDataLabel;

performRequest = reqSend.performRequest;

user = config.user;

exports.save_labels = function(req, res) {
	console.log("start");
	count = data.find({}).count();

	data.find({},function(err, docs){
		docs.forEach(function(element, index, array){
			console.log(index +'. '+element);
				mongoDataLabel.findOne({user_id : element.email.substring(0, element.email.indexOf("@"))},
					function(err, docsOne) {
						if (err) {
							console.log('error at find one data label : '+err);
						} else {
					
							var is_bad = true;
							
							if (element.red_result == "ACCEPT") {
								is_bad = false;
							} else {
								is_bad = true;
							}
							
							if (docsOne == null) {
								new mongoDataLabel(
										{
											api_key : user.apikey, // Required
															//Field
																	// Field
											user_id : element.email.substring(0,
														element.email.indexOf("@")),
			
											is_bad : is_bad, // ...
															// or
																// false;
											// Required
											// Field
											reasons : "fake", // Supported
																// Field;
											// Optional
											analyst : "yori.yostiani@veritrans.co.id",
											time : element.times
			
										}).save(function(err, mongoDataLabels) {
											if (err) {
												res.json(err);
												console.log("error posting data user "+ err);
											}
										});
									} else {
										console.log('is exists');
										docsOne.is_bad = is_bad;
										docsOne.save(function(err) {
											if (err) {
												console.error(err);
											}
										});
							}
						}
				}.bind(element)
				)
		});

		res.render('transaction/showall', {
			data : docs 
		});
		res.end();

		
	});
	
							
}
