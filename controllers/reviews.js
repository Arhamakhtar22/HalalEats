const Review = require('../models/review');
const Restaurant = require('../models/restaurant');

module.exports.createReview = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id //assign that review to the user id
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/restaurants/${restaurant._id}`);
}

module.exports.deleteReview = async(req, res) =>{
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/restaurants/${id}`);
}