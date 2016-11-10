var https = require('https'),
querystring = require('querystring');


//https.globalAgent.maxSockets = 30;
exports.performRequest = function (endpoint, method, data, success) {
	
	var dataString =  JSON.stringify(data);
	var headers ={};
 console.log('Sending Data : ' + dataString + '\n');
	if(method == 'GET'){
		endpoint += '?' + querystring.stringify(data);
	}else{
		headers = {
				'Content-Type' 		: 'application/json',
				'Content-Length'	: dataString.length
		};
	}
	var options = {
			host : user.host,
			path : endpoint,
			port : 443,
			method : method,
			headers : headers
	};

	var req = https.request(options, function(res){
		res.setEncoding('utf-8');
		
		var responseString = '';
		
		res.on('data', function(data){
			responseString += data;
		});
		
		res.on('end', function(){
			//console.log('RESULT : ' + responseString);
			if(method == 'GET'){
				console.log('endpoint : '+endpoint);
			}
// var responseObject = JSON.parse(responseString);
			success(responseString);
		});
	});
	
	req.write(dataString);
	
	req.end();
	req.on('error', function(e) {
		  console.error(e);
		});
}


