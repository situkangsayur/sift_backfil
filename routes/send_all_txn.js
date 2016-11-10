var reqSend = require('./../request_sender'), struct = require('./../data_structure'), config = require('./../sift_data'), sleep = require('sleep');

mongoDataEnt = struct.mongoDataEnt;
data = struct.data;
mongoDataUser = struct.mongoDataUser;
mongoDataLabel = struct.mongoDataLabel;

performRequest = reqSend.performRequest;

user = config.user;

exports.send_all = function(req, res) {
	console.log("start");
	// count = data.find({}).count();

	data
			.find(
					{},
					function(err, docs) {
						if (err) {
							res.json(err);
							console.log("error posting data");
						}

						console.log("data pass : " + docs.length);
						console.log("data pass : " + docs.length + " data : "
								+ docs[0].merchant_id + ";" + docs[0].email);

						//console.log("load data users");
						for (var i = 0; i < docs.length; i++) {
							var k = i;
							if ((i % 10000) == 0) {
								console.log("No : " + i);
								console.log("load data...");
							}
						
							if(i == 249){
							  sleep.sleep(1); 
							}	
							var card = docs[i].amount_authorize;

							new mongoDataUser({

								type : '$create_account',
								api_key : user.apikey,
								user_id : docs[i].email.substring(0,
										docs[i].email.indexOf("@")),

								// Supported Fields
								session_id : k,
								user_email : docs[i].email,
								name : docs[i].customer_name,
								phone : docs[i].phone,
								// referrer_user_id :
								// docs[i].email.substring(0,docs[i].email.indexOf("@")),
								payment_methods : [ {
									payment_type : "$credit_card",
									card_bin : docs[i].card_bin,
									card_last4 : docs[i].card_postfix
								} ],
								billing_address : {
									name : docs[i].customer_name,
									city : docs[i].city,
									country : docs[i].billing_country
											.substring(0, 2),
									zipcode : docs[i].postal_code
								}

							})
									.save(function(err, mongoDataUsers) {
										if (err) {
											res.json(err);
											console
													.log("error posting data user "
															+ err);
										} else {
											var dataJson = {
												$type : '$create_account',
												$api_key : mongoDataUsers.api_key,
												$user_id : mongoDataUsers.user_id,
												// Supported Fields
												$session_id : mongoDataUsers.session_id,
												$user_email : mongoDataUsers.user_email,
												$name : mongoDataUsers.name,
												$phone : mongoDataUsers.phone,
												$referrer_user_id : mongoDataUsers.referrer_user_id,
												$payment_methods : [ {
													$payment_type : mongoDataUsers.payment_methods[0].payment_type,
													$card_bin : mongoDataUsers.payment_methods[0].card_bin,
													$zipcode : mongoDataUsers.payment_methods[0].zipcode
												} ],
												$billing_address : {
													$name : mongoDataUsers.billing_address.name,
													$city : mongoDataUsers.billing_address.city,
													$country : mongoDataUsers.billing_address.country,
													$zipcode : mongoDataUsers.billing_address.postal_code
												}
											}

											// console.log(dataJson);
										
											performRequest(
													'/v203/events',
													'POST',
													dataJson,
													function(datas) {
														console
																.log('CREATE USER RESULT : '
																		+ datas);
													});
													
											/*
											 * request.post('https://api.siftscience.com/v203/events',{form:
											 * dataJson}, function(error,
											 * result, body){ if(err){
											 * console.log('error post data user : ' +
											 * err)
											 */
										}
									});

							// console.log("load data transaction")
							new mongoDataEnt({
								type : '$transaction',
								api_key : user.apikey,
								user_id : docs[i].email.substring(0,
										docs[i].email.indexOf("@")),
								// suppported fields
								user_email : docs[i].email,
								transaction_type : '$sale',
								transaction_status : '$success',
								amount : docs[i].amount_authorize,
								currency_code : 'IDR',
								transaction_id : docs[i].uuid,
								// billing
								billing_address : {
									name : docs[i].customer_name,
									phone : docs[i].phone,
									address_1 : docs[i].address,
									country : docs[i].billing_country
											.substring(0, 2)
								},

								payment_method : {
									payment_type : '$credit_card',
									card_bin : docs[i].card_bin,
									card_last4 : docs[i].card_postfix
								},
								seller_user_id : docs[i].merchant

							})
									.save(function(err, mongoDataEnts) {
										if (err) {
											res.json(err);
											console
													.log("error posting data transaction "
															+ err);
										} else {
											var dataJson = {
												$type : '$transaction',
												$api_key : mongoDataEnts.api_key,
												$user_id : mongoDataEnts.user_id,
												// suppported fields
												$user_email : mongoDataEnts.user_email,
												$transaction_type : '$sale',
												$transaction_status : '$success',
												$amount : mongoDataEnts.amount,
												$currency_code : 'IDR',
												$transaction_id : mongoDataEnts.transaction_id,
												// billing
												$billing_address : {
													$name : mongoDataEnts.billing_address.name,
													$phone : mongoDataEnts.billing_address.phone,
													$address_1 : mongoDataEnts.billing_address.address_1,
													$country : mongoDataEnts.billing_address.country
												},
												$payment_method : {
													$payment_type : mongoDataEnts.payment_method.payment_type,
													$card_bin : mongoDataEnts.payment_method.card_bin,
													$card_last4 : mongoDataEnts.payment_method.card_last4
												},
												$seller_user_id : mongoDataEnts.seller_user_id
											}
											// console.log(dataJson);
											
											performRequest(
													'/v203/events',
													'POST',
													dataJson,
													function(datas) {
														console
																.log('POST TRANSACTIONS RESULT : '
																		+ datas);
													});
													
										}
									})

							// console.log("load data label");
							var is_bad = true;
							// data label
							if (docs[i].red_result == "ACCEPT") {
								is_bad = false;
							}
							var userId = docs[i].email.substring(0,
									docs[k].email.indexOf("@"));
							/*
							new mongoDataLabel({

								api_key : user.apikey, // Required Field
								user_id : docs[i].email.substring(0,
										docs[k].email.indexOf("@")),
								is_bad : is_bad, // ... or false; Required
								// Field
								reasons : [ "fake" ], // Supported Field;
								// Optional
								analyst : "yori.yostiani@veritrans.co.id",
								time : docs[i].times

							})
									.save(function(err, mongoDataLabels) {
										if (err) {
											res.json(err);
											console
													.log("error posting data user "
															+ err);
										} else {
											if (is_bad) {
												var dataJson = {
													$api_key : mongoDataLabels.api_key, // Require
													$is_bad : true, // ... or
													// false;
													// Required
													// Field
													$reasons : [ "fake" ], // Supported
													// Field;
													// Optional
													$analyst : "yori.yostiani@veritrans.co.id",
													$time : mongoDataLabels.time
												}
											} else {
												var dataJson = {
													$api_key : mongoDataLabels.api_key, // Require
													$is_bad : false, // ...
													// or
													// false;
													// Required
													// Field
													$analyst : "yori.yostiani@veritrans.co.id",
													$time : mongoDataLabels.time
												}
											}
											// console.log(dataJson);
											performRequest(
													'/v203/users/' + userId
															+ '/labels',
													'POST',
													dataJson,
													function(datas) {
														console
																.log('POST DATA LABEL RESULT : '
																		+ datas);
													});
										}
									});
							*/
						}

						res.render('transaction/showall', {
							data : docs
						});
						res.end();
					});
}
