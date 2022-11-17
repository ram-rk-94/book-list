const router = require('express').Router();
const booksController = require('../controllers/books');
const {authorize} = require('../middlewares/authorize');
const {authenticate} = require('../middlewares/authenticate');

router.post('/createBookList',authenticate,  authorize, booksController.createList);
router.get('/getBookList/:id',authenticate,  booksController.getBooklist);

module.exports = router;