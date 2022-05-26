const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../helpers/catchAsync');
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const { validateReview, loggedIn, isReviewOwner } = require('../auth_middleware');



router.post('/', loggedIn, validateReview, catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id //assign that review to the user id
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/restaurants/${restaurant._id}`);
}));

router.delete('/:reviewId', loggedIn, isReviewOwner, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/restaurants/${id}`);
}))

module.exports = router;