const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../helpers/catchAsync');
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const { validateReview, loggedIn, isReviewOwner } = require('../auth_middleware');
const reviews = require('../controllers/reviews');



router.post('/', loggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', loggedIn, isReviewOwner, catchAsync(reviews.deleteReview));

module.exports = router;