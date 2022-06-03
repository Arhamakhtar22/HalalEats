const Joi = require('joi');

module.exports.restaurantSchema = Joi.object({
    restaurant: Joi.object({
        title: Joi.string().required(),
        phonenumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        image: Joi.string(),//.required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImage: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})