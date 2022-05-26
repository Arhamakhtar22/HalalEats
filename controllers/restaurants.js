const Restaurant = require('../models/restaurant');

module.exports.index = async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants })
}

module.exports.newForm = (req, res) =>{
    res.render('restaurants/new');
}
 module.exports.newRestaurant = async (req, res, next) => {
    //if(!req.body.restaurant) throw new ExpressError('Invalid Restaurant Data', 400);
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.owner = req.user._id; //asign that restaurant to the user id
    await restaurant.save();
    req.flash('success', 'Successfully made a new restaurant')
    res.redirect(`/restaurants/${restaurant._id}`)
 }

module.exports.displayRestaurant = async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate({
        path: 'reviews', //first populate the review model
        populate: {
            path: 'owner' //then populate the owner of that review
        }
    }).populate('owner'); //then populate the owner of the restaurant
    if (!restaurant) {
        req.flash('error', 'Restaurant not found'); //if finding by id and its not there
        return res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurant });
}

module.exports.editRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
        req.flash('error', 'Restaurant not found');
        return res.redirect('/restaurants');
    }
    if (restaurant.owner.equals(req.user._id)) {
        res.render('restaurants/edit', { restaurant });
    } else {
        req.flash('error', 'You are not authorized to edit this restaurant')
        res.redirect(`/restaurants/${id}`)
    }
}

module.exports.updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (restaurant.owner.equals(req.user._id)) {
        const findRestaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant });
        req.flash('success', 'Updated successfully!')
        res.redirect(`/restaurants/${restaurant._id}`)
    } else {
        req.flash('error', 'You are not authorized to edit this restaurant')
        res.redirect(`/restaurants/${id}`)
    }
}

module.exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted!')
    res.redirect('/restaurants');
}