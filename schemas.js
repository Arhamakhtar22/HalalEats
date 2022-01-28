const Joi = require('joi');

module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
        title: Joi.string().required(),
        phonenumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});