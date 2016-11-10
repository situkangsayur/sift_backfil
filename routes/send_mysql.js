var reqSend = require('./../request_sender'), 
struct = require('./../data_structure'),
config = require('./../sift_data'),
request = require('request'),
mysql = require('mysql'),
sleep = require('sleep');

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'veritrans'
});
mongoDataUser = struct.mongoDataUser;
mongoScore = struct.mongoDataScore;


exports.send_scores =  function(req, res){
	
	mongoScore.find({}, function(err, docs){
		if(err){
			console.log('error find scores');
		}else{
			docs.forEach(function(element,index,array){
				//var post  = {id: 1, title: 'Hello My'};
				console.log(index + ' : '+element)
				mongoDataUser.findOne({user_id : element.user_id},function(err, data){
					var socres = {
						user_id : element.user_id,
						country : data.billing_address.country,
						city	: data.billing_address.city,
						email	: data.user_email,
						score	: element.score,
						status  : element.status,
						error_message : element.error_message,
						latest_label : JSON.stringify(element.latest_label),
						reasons	: '',
						__v 	: element.__v,
						match_result : element.match_result,
						good : element.good,
						sanggahan	: element.sanggahan,
						
					}
					var query = connection.query('INSERT INTO socres SET ?', socres, function(err, result) {
							   if(err){
								   console.log('error insert data :'+ err);
							   }else{
								   console.log('data masuk : '+index);
							   }
						});
					});
				});
			}
		}
	)
	res.send("waiting for responses..");
}