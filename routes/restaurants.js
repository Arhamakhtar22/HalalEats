const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressError');
const Restaurant = require('../models/restaurant');
const { restaurantSchema, reviewSchema } = require('../schemas.js');
const flash = require('connect-flash');

const validateRestaurantInfo = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants })
}));

router.get('/new', (req, res) => {
    res.render('restaurants/new');
});

router.post('/', validateRestaurantInfo, catchAsync(async (req, res, next) => {
    
    //if(!req.body.restaurant) throw new ExpressError('Invalid Restaurant Data', 400);
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    req.flash('success', 'Successfully made a new restaurant')
    res.redirect(`/restaurants/${restaurant._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate('reviews');
    if(!restaurant){
        req.flash('error', 'Restaurant not found'); //if finding by id and its not there
        return res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurant });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
        req.flash('error', 'Restaurant not found'); 
        return res.redirect('/restaurants');
    }
    res.render('restaurants/edit', { restaurant });
}));

router.put('/:id',validateRestaurantInfo, catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant });
    req.flash('success', 'Successfully updated!')
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted!')
    res.redirect('/restaurants');
}));
module.exports = router;