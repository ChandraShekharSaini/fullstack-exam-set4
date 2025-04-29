const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');


router.get('/register', (req, res) => {
  res.render('register');
});


router.post('/register', async (req, res) => {
  const { username, password, gender, number } = req.body;
  
  try {
    const user = new User({
      username,
      password,
      gender,
      number,
      coursesEnrolled: []
    });

    await user.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (err) {
    req.flash('error_msg', 'Registration Error');
    res.redirect('/users/register');
  }
});


router.get('/login', (req, res) => {
  res.render('login');
});


router.post('/login', passport.authenticate('local', {
  successRedirect: '/subjects',
  failureRedirect: '/users/login',
  failureFlash: true
}));


router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
});

module.exports = router; 