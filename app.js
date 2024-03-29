if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express= require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate');
const ExpressError = require('./helpers/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localPassport = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
<<<<<<< HEAD
const MongoDBStore = require("connect-mongo")(session);

const database_url = process.env.DB_URL || "mongodb://localhost:27017/eatsdb";
=======
const helmet = require('helmet');
>>>>>>> 03873af756150eeea5b7b28429b66ccd15f5b400



const authRoute = require('./routes/auth');
const restaurantsRoute = require('./routes/restaurants');
const reviewsRoute = require('./routes/reviews');
const MongoStore = require('connect-mongo');

mongoose.connect(database_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app= express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'sui'

const store = new MongoDBStore({
    url: database_url,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig ={
<<<<<<< HEAD
    store: store,
    secret,
=======
    name: 'session',
    secret: 'thisisasecert',
>>>>>>> 03873af756150eeea5b7b28429b66ccd15f5b400
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
app.use(helmet());

app.use(mongoSanitize());

app.use(passport.initialize());
app.use(passport.session()); //for presistent login sessions 
passport.use(new localPassport(User.authenticate())); 

passport.serializeUser(User.serializeUser()); //how to store a user in a session
passport.deserializeUser(User.deserializeUser()); //how to get the user out of the session


app.use((req, res, next) => {   //middleware for flashing success and error msg
    res.locals.signedinUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.engine('ejs', ejsmate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use('/restaurants', restaurantsRoute);
app.use('/restaurants/:id/reviews', reviewsRoute)
app.use('/', authRoute);

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

<<<<<<< HEAD
const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`Serving on port ${port}`)
})
=======
app.listen(3000, () =>{
    console.log('Serving on port 3000')
})
>>>>>>> 03873af756150eeea5b7b28429b66ccd15f5b400
