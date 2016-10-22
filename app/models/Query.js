var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var QuerySchema   = new Schema({
	name: String
});

module.exports = mongoose.model('Query', QuerySchema);