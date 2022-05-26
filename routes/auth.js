const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../helpers/catchAsync')
const passport = require('passport');
const users = require('../controllers/auth');

router.get('/register', users.newUser);

router.post('/register', catchAsync(users.registerUser));

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
