const Restaurant = require('../models/restaurant');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBox_Token = process.env.MAPBOX_TOKEN;
const geocode = mbxGeocoding({ accessToken: mapBox_Token })

module.exports.index = async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants })
}

module.exports.newForm = (req, res) =>{
    res.render('restaurants/new');
}
 module.exports.newRestaurant = async (req, res, next) => {
    const geoData = await geocode.forwardGeocode({
        query: req.body.restaurant.location,
        limit: 1
    }).send()
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.geometry = geoData.body.features[0].geometry;
    restaurant.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
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
        const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        restaurant.image.push(...images); //take the data from array above and pass that inti push
        await restaurant.save()
        console.log(restaurant)
        if (req.body.deleteImage){ //if there are any images to delete
            for (let filename of req.body.deleteImage){
                await cloudinary.uploader.destroy(filename); //delete the images from cloudinary 
            }
            await findRestaurant.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage }}}}) //pull from the image array, where the filename is in req.body
            console.log(findRestaurant)
        }
        //console.log(req.body)
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
