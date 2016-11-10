/**
 * Module dependencies.
 */

var express = require('express'), 
querystring = require('querystring'),
str = require('string'),
data_structure = require('./structure'),
routes = require('./routes/index'), 
transaction = require('./routes/transaction'), 
http = require('http'),
struct = require('./data_structure'),
path = require('path'),
sift = require('./sift_data'),
sendAll = require('./routes/send_all_txn'),
sendLabels = require('./routes/send_labels'),
score = require('./routes/get_score_sifts'),
matching = require('./routes/matching'),
checking = require('./routes/checkchargeback'),
sending = require('./routes/send_mysql'),
savelabels = require('./routes/splitlabels');


var app = express();

// all environments
app.set('port', process.env.PORT || 1234);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// apps

app.get('/', routes.index);

mongoDataEnt = struct.mongoDataEnt; 
data = struct.data;
mongoDataUser = struct.mongoDataUser;
mongoDataLabel = struct.mongoDataLabel;
mongoDataScore = struct.mongoDataScore;


app.get("/transaction/jsons", function(req, res){
	data.find({}, function(err, docs){
// console.log(docs);
		res.render(docs);
	})
})

// account
user = sift.user;

app.get('/transaction/sendall', sendAll.send_all);
// sending data
app.get('/transaction/sendlabels',sendLabels.send_labels);

// load sift score

app.get('/transaction/getscore',score.get_score);

//save sift label
app.get('/transaction/savelabels',savelabels.save_labels);


//data validate sanggahan
app.get('/transaction/sanggahan', checking.checkaccuration);

//send to mysql 
app.get('/transaction/sendtomysql', sending.send_scores);


//results data compare

app.get('/transaction/result_redsifts', matching.get_matching);
app.get('/transaction/show_match_sys', function(req, res){
	mongoDataScore.find({}, function(err, docs){
		if(err){
		  console.log(err);
		}		
		res.render('transaction/result_score_compare',{ 
			data : docs
		});	
	});
});
// crud transactions

app.get('/transaction/alldata',function(req, res){
	data.find({},function(err, docs){
		res.render('transaction/showall',{
			data : docs
		});
	});
})

app.get('/transaction',function(req, res){
	data.find({},function(err, docs){
		res.render('transaction/showall',{
			data : docs
		});
	});
})

// new transaction
app.get('/transaction/baru', function(req, res){
	res.render('transaction/baru');
})

// post new transaction
app.post('/transaction', function(req, res){
	var b = req.body;
	new data({
		uuid		: b.uuid,
		card_bin	: b.card_bin,
		amount_authorize		: b.amount_authorize,
		times		: b.times,
		sector		: b.sector,
		fraud_result	: b.fraud_result,
		ip_address	: b.ip_address,
		email		: b.email,
		customer_phone	: b.customer_phone,
		billing_country	: b.billing_country,
		shipping_phone	: b.shipping_phone,
		country_code	: b.country_code,
		merchant		: b.merchant
	}).save(function(err, data_merchant){
		if(err){
			res.json(err);
			console.log('error posting data');
		}	
		console.log('post data berhasil');
		res.redirect('/transaction/' + b.uuid)
	})
})

app.param('uuid', function(req, res, next, uuid){
	data.find({
		uuid	: uuid
	}, function(err, docs){
			req.data = docs[0];
			next();
	});
});

app.get('/transaction/:uuid',function(req, res){
	res.render('transaction/show',{
		data : req.data
	})
})
	
app.get('/transaction/:uuid/edit', function(req, res){
	res.render('transaction/edit',{
		data : req.data
	});
})

app.put('/transaction/:uuid', function(req, res){
	var b = req.body;
	data.update({
		uuid : req.params.uuid
	}, {
		uuid		: b.uuid,
		card_bin	: b.card_bin,
		amount_authorize		: b.amount_authorize,
		times		: b.times,
		sector		: b.sector,
		fraud_result	: b.fraud_result,
		ip_address	: b.ip_address,
		email		: b.email,
		customer_phone	: b.customer_phone,
		billing_country	: b.billing_country,
		shipping_phone	: b.shipping_phone,
		country_code	: b.country_code,
		merchant		: b.merchant
		
	}, function(err){
		res.redirect("/transaction/"+b.uuid);
 	})
})

app.delete('/transaction/:uuid', function(req, res){
	data.remove({uuid : req.params.uuid}, function(err){
		res.redirect('/transaction');
	});
});


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
