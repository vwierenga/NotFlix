/**
 * Created by Vincent on 10/12/2016.
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RatingSchema   = new Schema({
    imdb_number: { type: Number, required: true },
    rating: { type: Number, required: true },
    by_user: { type: String, required: true }
});

module.exports = mongoose.model('Rating', RatingSchema);