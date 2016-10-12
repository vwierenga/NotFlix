/**
 * Created by Vincent on 10/7/2016.
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    last_name: String,
    surname_prefix: String,
    first_name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);