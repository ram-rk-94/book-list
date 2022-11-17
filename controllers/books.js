const bookSchema = require('../models/bookDetails');
const validation = require('../validation');

const createList = async function(req, res) {
    let responseObj = new Object();
    try {

        //Validate the schema
        const validationResult = validation.BookSchema(req.body);
        if(validationResult.error) {
            responseObj.error = validationResult.error;
            responseObj.statusCode = 500;
            return res.status(500).send({responseObj});
        }

        //Check for existing book
        const existingBook = await bookSchema.findOne({id: req.body.id});
        if(existingBook) {
            responseObj.message = "Book already in list";
            responseObj.statusCode = 500;
            return res.status(500).send({responseObj});
        }

        // Create a new book
        const book = new bookSchema({
            bookId: req.body.id,
            name: req.body.name,
            isbn: req.body.isbn,
            author: req.body.author
        });

        const savedBook = await book.save();
        responseObj.statusCode = 200;
        responseObj.data = savedBook;
        return res.status(200).send({responseObj});
    } catch(err) {
        responseObj.error = err;
        responseObj.statusCode = 500;
        return res.status(500).send(responseObj);
    }
}

const getBooklist = async function(req, res) {
    let responseObj = new Object();
    try {
        // Check for specific id
        const id = req.query.id;
        if(id) {
            const getBook = await bookSchema.findOne({bookId: req.query.id });
        }
        const getBooks = await bookSchema.find();

        responseObj.statusCode = 200;
        responseObj.data = getBook || getBooks;
        return res.status(200).send({responseObj});
    } catch(err) {
        responseObj.statusCode = 500;
        responseObj.error = err;
        return res.status(500).send({responseObj});
    }
}

module.exports = {
    getBooklist: getBooklist,
    createList: createList
}