/**
 * Created by Vincent on 10/7/2016.
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MovieSchema   = new Schema({
    imdb_number: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    published_at: Date,
    lenght: Number,
    director: String,
    short_description: String
});

module.exports = mongoose.model('Movie', MovieSchema);