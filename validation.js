const joi = require('@hapi/joi');

const BookSchema = (req)=> {
    const schema = joi.object({
        id: joi.string().required(),
        name: joi.string().required(),
        author: joi.string().required(),
        isbn: joi.string().required()
    });

    return schema.validate(req);
};

module.exports = {
    BookSchema: BookSchema
};