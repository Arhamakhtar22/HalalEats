const express= require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
const ExpressError = require('./helpers/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');


const restaurants = require('./routes/restaurants');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/eatsdb',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app= express();

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig ={
    secret: 'thisisasecert',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //so that users dont stay logged in forever
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {   //middleware for flashing success and error msg
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.engine('ejs', ejsmate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use('/restaurants', restaurants);
app.use('/restaurants/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.send("HOME")
})

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
