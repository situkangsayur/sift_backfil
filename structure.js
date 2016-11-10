var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/sift_test2");
exports.mongo = mongoose;

exports.data_merchant = new mongoose.Schema({
	merchant_id : String,
	time : Number,
	customer_name : String,
	postal_code : String,
	city : String,
	ip_address : String,
	email : String,
	amount_authorize : Number,
	phone : Number,
	billing_country : String,
	country_code : String,
	card_bin : Number,
	card_postfix : Number,
	sector : String,
	red_result : String,
	merchant : String,
	data_label: Boolean
});
/*
 * exports.data_merchant = new mongoose.Schema({ uuid : String, card_bin :
 * Number, amount_authorize : Number, times : Number, sector : String,
 * fraud_result : String, ip_address : String, email : String, customer_phone :
 * Number, billing_country : String, shipping_phone : Number, country_code :
 * String, merchant : String, label : Boolean });
 */

exports.label_mongo = new mongoose.Schema({

	api_key : String, // Required Field
	user_id : String,
	is_bad : Boolean, // ... or false; Required Field
	reasons : String, // Supported Field; Optional
	description : String, // Optional
	source : String, // Optional field indicating where the
	// label came from
	time : Number,
	analyst : String
// Optional field indicating the
});

exports.singlelabel_mongo = new mongoose.Schema({

	api_key : String, // Required Field
	user_id : String,
	is_bad : Boolean, // ... or false; Required Field
	reasons : String, // Supported Field; Optional
	description : String, // Optional
	source : String, // Optional field indicating where the
	// label came from
	time : Number,
	analyst : String
// Optional field indicating the
});

exports.user_mongo = new mongoose.Schema({
	// Sample $create_account event

	// Required Fields
	type : String,
	api_key : String,
	user_id : String,

	// Supported Fields
	session_id : String,
	user_email : String,
	name : String,
	phone : String,
	referrer_user_id : String,
	payment_methods : [ {
		payment_type : String,
		card_bin : String,
		card_last4 : String
	} ],
	billing_address : {
		name : String,
		phone : String,
		address_1 : String,
		address_2 : String,
		city : String,
		region : String,
		country : String,
		zipcode : String
	},

	social_sign_on_type : String,

	// Suggested Custom Fields
	twitter_handle : String,
	work_phone : String,
	location : String,
	referral_code : String,
	email_confirmed : false

})

exports.ent_mongo = new mongoose.Schema({
	// require fields
	type : String,
	api_key : String,
	user_id : String,
	// suppported fields
	user_email : String,
	transaction_type : String,
	transaction_status : String,
	amount : Number,
	currency_code : String,
	order_id : String,
	transaction_id : String,

	// billing
	billing_address : {
		name : String,
		phone : String,
		address_1 : String,
		address_2 : String,
		city : String,
		region : String,
		country : String,
		zipcode : String
	},

	payment_method : {
		payment_type : String,
		payment_gateway : String,
		card_bin : String,
		card_last4 : String
	},

	// Supported Fields
	shipping_address : {
		address_1 : String,
		address_2 : String,
		city : String,
		region : String,
		country : String,
		zipcode : String
	},
	session_id : String,
	seller_user_id : String,
	coupon_code : String,
	shipping_method : String,
	is_first_time_buyer : Boolean
})

exports.score_mongo = new mongoose.Schema({
	user_id : String,
	score : Number,
	reasons : [],
	latest_label : {
		is_bad : Boolean,
		time : Number,
		reasons : [ String ],
		desciption : String
	},
	status : 0,
	error_message : String,
	good : Boolean,
	match_result : Boolean,
	sanggahan : Boolean
});

exports.suratsanggahan = new mongoose.Schema({
	payment_type : String,
	trade_time : String,
	order_id : String,
	cc_number : String,
	email : String,
	amount : Number,
	security_recom : String,
	latest_status : String,
	result : String,
	surat_sanggahan : String,
	tanggal : String,
	notes : String,
	merchant : String
})
