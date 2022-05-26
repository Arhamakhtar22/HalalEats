const User = require('../models/user');

module.exports.newUser = (req, res) => {
    res.render('users/register');
};

module.exports.registerUser = async (req, res) => { // route to register a new user
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password); //.register hashes and adds salt to the password, stores the result on our new user
        req.login(registeredUser, err => { //built in login fun in passport to have the user logged in automatically after registering
            if (err) return next(err);
            req.flash('success', 'Registered successfully!');
            res.redirect('/restaurants')
        })
    } catch (error) { // catch the mongoose error and flash it
        req.flash('error', error.message);
        res.redirect('register');
    }
};