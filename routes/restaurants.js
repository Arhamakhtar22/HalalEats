const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const Restaurant = require('../models/restaurant');
const { loggedIn, validateRestaurantInfo } = require('../auth_middleware')
const restaurants = require('../controllers/restaurants');

router.get('/', catchAsync(restaurants.index));

router.get('/new', loggedIn, restaurants.newForm);

router.post('/', loggedIn, validateRestaurantInfo, catchAsync(restaurants.newRestaurant));

router.get('/:id', catchAsync (restaurants.displayRestaurant));

router.get('/:id/edit', loggedIn, catchAsync(restaurants.editRestaurant));

router.put('/:id', loggedIn, validateRestaurantInfo, catchAsync(restaurants.updateRestaurant));
    
router.delete('/:id', loggedIn, catchAsync( restaurants.deleteRestaurant));

module.exports = router;