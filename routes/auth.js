const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../helpers/catchAsync')
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async(req, res)=>{ // route to register a new user
    try {
        const {email, username, password} = req.body;
        const user = new User({ email, username});
        const registeredUser = await User.register(user, password); //.register hashes and adds salt to the password, stores the result on our new user
        req.login(registeredUser, err => { //built in login fun in passport to have the user logged in automatically after registering
            if(err) return next(err);
            req.flash('success', 'Registered successfully!');
            res.redirect('/restaurants')
        })
    } catch(error){ // catch the mongoose error and flash it
        req.flash('error', error.message); 
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res)=>{ // flashes the message automatically
    const {username} = req.body;
    req.flash('success',`Welcome back ${username}!`);
    res.redirect('/restaurants');
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "LoggedOut!")
    res.redirect('/restaurants');
})

module.exports = router;
