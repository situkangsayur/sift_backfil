var struct = require('./../data_structure'),
config = require('./../sift_data'),
request = require('request'),
sleep = require('sleep');


 
data = struct.data;
mongoDataScore = struct.mongoDataScore;
mongoDataScoreUpdate = struct.mongoDataupdate;


exports.get_matching = function(req, res){
	
		data_label = false;
		
		data.find({},function(err, docs){
			if(err){
				res.json(err);
				console.log('error load data');
			}
			docs.forEach(function(element, index, err){
				
				username = element.email.substring(0,element.email.indexOf("@"));
				if(element.data_label== false){
				console.log(element.data_label);
				}
				data_label = element.data_label;
				
				mongoDataScore.findOne({user_id : username},function(err, data_score){
					if(err){
						res.json(err);
						console.log('error load data score');
					}
					
					console.log('result : ' + element.data_label+' ; good : '+data_score.good);
					
				 	if( data_score.good == element.data_label){
						data_score.match_result = true;
				 	}else{
						data_score.match_result = false;
					}
					
				 	//console.log(JSON.stringify(result));
				 	
				 	//mongoDataScoreUpdate.update({user_id : data_score.user_id},
					//	user_id : data_score[0].
					//	, function(err, results){
				 	//	if(err){
				 	//		res.json(err);
				 	//		console.log('error update data score');
				 	//	}else{
				 	//		console.log('update done ; ' + results.length);
				 	//	}
				 	//});
				 	
					data_score.save(function(err){
						if(err){
							console.error(err);
						}	
					});
				}.bind({ data_label : data_label}));
			}
			);
			mongoDataScore.find({},function(err, docs){
				res.render('transaction/result_score_compare',{
					data : docs
				});
			});

		});
}
