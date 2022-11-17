const Joi = require('@hapi/joi');

const Registerschema = (req)=>{
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required(),
        admin: Joi.boolean().required()
    });

    return schema.validate(req);
}

const Loginschema = (req)=>{
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8)
    });

    return schema.validate(req);
}

module.exports = {
    Registerschema: Registerschema,
    Loginschema: Loginschema
};