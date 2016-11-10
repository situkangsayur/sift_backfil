var reqSend = require('./../request_sender'), struct = require('./../data_structure'), config = require('./../sift_data');

mongoDataEnt = struct.mongoDataEnt;
data = struct.data;
mongoDataUser = struct.mongoDataUser;
mongoDataLabel = struct.mongoDataLabel;

performRequest = reqSend.performRequest;

user = config.user;

exports.send_labels = function(req, res) {
	console.log("start");

	mongoDataLabel.find({},
			function(err, docs) {
				if (err) {
					res.json(err);
					console.log("error posting data");
				}

				console.log('data label pass : ' + docs.length + ' data : ' + ';' + docs[0].user_id);

				console.log('load data label');
				docs.forEach(function(element, index, array){
				
					
						console.log("No : " + index+' : '+element.user_id);

							if (element.is_bad) {

								var dataJson = {
									$api_key : element.api_key, // Require
									$is_bad : true,
									$reasons : [ "$fake" ], // Supported Field;
									// Optional
									$analyst : "yori.yostiani@veritrans.co.id",
									$time : element.time
								}
							} else {

								var dataJson = {
									$api_key : element.api_key, // Require
									$is_bad : false,
									$analyst : "yori.yostiani@veritrans.co.id",
									$time : element.time
								}
							}
							console.log('send data to sift : /v203/users/'
									+ element.user_id + '/labels');
							
							performRequest('/v203/users/'
									+ element.user_id + '/labels',
									'POST',

									dataJson, function(datas) {
										console.log('POST DATA LABEL RESULT : '
												+ datas+ ' for ' +element.user_id);
									});
									
					});
				

				res.render('transaction/showall', {
					data : docs
				});
				res.end();
			});
}
