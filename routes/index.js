const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/', (req,res)=>{
    res.render("landing");
}); 

//===========================
//auth routes
//===========================

router.get('/register', (req,res)=>{
    res.render('authentification/register');
});

router.post('/register', (req,res)=>{
    User.register(new User({username:req.body.username}), req.body.password, (err, user)=>{
        if(err){
            req.flash('error', err.message);
            return res.render('authentification/register')
        }
        passport.authenticate('local')(req, res, ()=>{
            req.flash('success', `Welcome to YelpCamp ${user.username}`);
            res.redirect('/campgrounds');
        })
    })
})

//login
router.get('/login', (req,res)=>{
    res.render('authentification/login');
})

//the middleware uses this passport.use(new LocalStrategy(User.authenticate())); to authenticate
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req,res)=>{

})

//logout
router.get('/logout', (req,res)=>{
    req.logOut();
    req.flash('success', "logged you out!")
    res.redirect('/campgrounds');
})


module.exports = router;