var reqSend = require('./../request_sender'), struct = require('./../data_structure'),
config = require('./../sift_data'),
request = require('request'),
sleep = require('sleep');




mongoDataUser = struct.mongoDataUser;
mongoScore = struct.mongoDataScore;

performRequest = reqSend.performRequest;

user = config.user;
var list_user = [];

exports.get_score =  function(req, res){
	
	count = data.find({}).count();
	
	mongoDataUser.find({},function(err, docs){
		if(err){
			res.json(err);
			console.log("error posting data");
		}else{

		console.log('load data user scores');
		docs.forEach(function(element,index,array){
			
				
				if(list_user.indexOf(element.user_id) == -1 ){
					list_user.push(element.user_id);
					
					request.get('https://api.siftscience.com/v203/score/'+element.user_id+'/?api_key='+user.apikey, function(error, result, body){
//					try{	
						var resObj = JSON.parse(body);
						new mongoScore({
								user_id : resObj.user_id,
									score	: resObj.score,
									reasons	:resObj.reasons,
									latest_label	: resObj.latest_label,
									status	: resObj.status,
									error_message : resObj.error_message
								}).save(function(err, pushRes){
									if(err){
 										res.json(err);
 										console.log('error save data to mongo : '+ err);
									}
								});
//					}catch(err){
//						console.log('error catch : '+err);
//						continue;
//					}
						console.log(body);
						});

					}
				
				
			});
		}
	});
	res.send("waiting for responses..");
}