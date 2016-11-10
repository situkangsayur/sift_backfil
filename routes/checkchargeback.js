var reqSend = require('./../request_sender'), struct = require('./../data_structure'), config = require('./../sift_data'), request = require('request'), sleep = require('sleep');

mongoDataUser = struct.mongoDataUser;
mongoDataScore = struct.mongoDataScore;
mongoSanggahan = struct.mongoSanggahan;

performRequest = reqSend.performRequest;

user = config.user;
var list_user = [];

exports.checkaccuration = function(req, res) {

	console.log("start");

	mongoDataScore.find({}, function(err, scores) {
		if (err) {
			res.json(err);
			console.log("error load datascore");
		} else {
			scores.forEach(function(elementScore, index, array){
				
					console.log('akun user id : ' + elementScore.user_id)
					
					//data = scores[i];
					
					mongoDataUser.findOne({
						user_id : elementScore.user_id
					}, function(err, users) {
						if (err) {
							console.log("error load data mongo users");
							res.json(err);
						} else {
	// console.log('akun email : ' + users.user_email);
						if(users != null){
							mongoSanggahan.find({
								email : users.user_email.toLowerCase()
							}, function(err, sanggahans) {
								console.log(sanggahans);
								if (err) {
									console.log("error load data surat sanggahan");
									res.json(err);
								} else {
									//sanggahans.forEach(function(elementSanggahan, index, array){});
									//temp = true;
									//console.log(err)
									if (sanggahans.length == 0) {
										console.log("not found "
														+ users.user_email);
									} else {
										if (scores.good) {
											elementScore.sanggahan = false;
											//temp = false;
										}else{
											elementScore.sanggahan = true;
										}
										elementScore.save(function(err){
											if(err){
												console.log(err);
											}
										});
										console
										.log("found" + users.user_email);
									}
									
								}
							});
						}
						}
					}.bind(elementScore));
				
				
				
			})
			
		}
	});
}
