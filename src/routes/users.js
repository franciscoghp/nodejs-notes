const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const passport = require('../config/passport')

router.get( '/users/signin', ( req, res ) => {
    res.render('users/signin')
}),

router.get( '/users/signup', ( req, res ) => {
    res.render('users/signup')
});

router.get( '/users/logout', ( req, res ) => {
    req.logout()
    res.redirect('/')
});

router.post( '/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.post( '/users/signup', async ( req, res ) => {
    const { name, email, password, confirm_password  } = req.body

    const errors = [];
    if(!name || !email || !password || !confirm_password){
        errors.push({text: 'You need to fill the data'});
        res.render('users/signup', {errors})
    }
    if(password != confirm_password) errors.push({ text: 'Passwords do not match' })
    if(password.length < 4) errors.push({ text: 'Passwords must be most large than 4 digits' })
    if(errors.length > 0) res.render('users/signup', {errors})
    else  {
        const emailUser = await User.findOne({ email});
        if(emailUser) {
            req.flash('error_msg', 'The Email is already in use.');
            res.redirect('/users/signup')
        }
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save()
        req.flash('success_msg', 'Te registraste con éxito');
        res.redirect('/users/signin')
    }
    
});


module.exports = router