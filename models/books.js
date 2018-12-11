let mongoose = require('mongoose');
let BookSchema = new mongoose.Schema({
        book_name: String,
        author: String,
        publishing: String,
        upvotes: {type: Number, default: 0},
        status: {type: String, default: "true"}  //status true means book is in library, and false means book isn't in library.
    },
    {collection:'books'});
module.exports = mongoose.model('Book',BookSchema);
