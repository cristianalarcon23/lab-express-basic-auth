const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/signup', async (req, res, next) => {
    res.render('auth/signup');
  })

router.get("/login", (req, res, next) => {
    res.render("auth/login");
  });

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.render('auth/login', { error: 'All fields are mandatory. Please fill them before submitting.' })
      return;
    }
    try {
      const user = await User.findOne({ username });
      if (!user) {
        res.render('auth/login', { error: 'Username is not registered. Try with another one.' })
        return;
      } else {
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
        if (passwordMatch) {
          req.session.currentUser = user;
          res.redirect('/')
        } else {
          res.render('auth/login', { error: 'Unable to authenticate user.' })
          return;
        }
      }
    } catch (error) {
      next(error);
    }
  })

router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/signup', { error: 'All fields are mandatory. Please fill them before submitting.' })
        return;
    }
    const regexPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regexPassword.test(password)) {
        res.render('auth/signup', { error: 'Password must have lowercase letters, uppercase letters and at least one number.' })
        return;
    }
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({ username, hashedPassword });
        res.redirect('/');
    } catch (error) {
        next(error)
    }
});

router.get("/logout", (req, res, next) => {
    req.session.destroy();
    req.app.locals.currentUser = false;
    res.redirect("/auth/login");
  });

module.exports = router;