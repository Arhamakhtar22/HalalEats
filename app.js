const express= require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
const catchAsync = require('./helpers/catchAsync');
const ExpressError = require('./helpers/ExpressError');
const methodOverride = require('method-override');
const Restaurant = require('./models/restaurant');
const {restaurantSchema} = require('./schemas.js');

mongoose.connect('mongodb://localhost:27017/eatsdb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app= express();

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.engine('ejs', ejsmate)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

const validateRestaurantInfo = (req, res, next) => {
        const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) =>{
    res.send("HOME")
})

app.get('/restaurants', catchAsync(async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants })
}));

app.get('/restaurants/new', (req, res) => {
    res.render('restaurants/new');
});

app.post('/restaurants',validateRestaurantInfo, catchAsync(async (req, res, next) => {
        //if(!req.body.restaurant) throw new ExpressError('Invalid Restaurant Data', 400);
        const restaurant = new Restaurant(req.body.restaurant);
        await restaurant.save();
        res.redirect(`/restaurants/${restaurant._id}`)
}));

app.get('/restaurants/:id', catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    res.render('restaurants/show', { restaurant });
}));

app.get('/restaurants/:id/edit', catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    res.render('restaurants/edit', { restaurant });
}));

app.put('/restaurants/:id',validateRestaurantInfo,catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
    res.redirect(`/restaurants/${restaurant._id}`);
}));

app.delete('/restaurants/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect('/restaurants');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () =>{
    console.log('Serving on port 3000')
})
