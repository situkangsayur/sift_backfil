var data_structure = require('./structure')

exports.mongoDataEnt = data_structure.mongo.model('data_sift', data_structure.ent_mongo); 
//exports.data = data_structure.mongo.model('data_merchant', data_structure.data_merchant); 
exports.data = data_structure.mongo.model('datamerchants', data_structure.data_merchant);
exports.mongoDataUser = data_structure.mongo.model('user_sift', data_structure.user_mongo);
exports.mongoDataLabel = data_structure.mongo.model('label_sift', data_structure.label_mongo);
exports.mongoDataLabelSingle = data_structure.mongo.model('singlelabel_sift', data_structure.singlelabel_mongo);
exports.mongoDataScore = data_structure.mongo.model('score_sift', data_structure.score_mongo);
exports.mongoDataScoreUpdate = data_structure.mongo.model('score_sift', data_structure.score_mongo);
exports.mongoSanggahan = data_structure.mongo.model('suratsanggahan', data_structure.suratsanggahan);