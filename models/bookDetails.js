const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Books', bookSchema);