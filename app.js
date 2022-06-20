// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');
require('./db');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();
app.set('trust proxy', 1);
app.use(
  session({
    name: 'authlab',
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 2592000000 // 30 days in milliseconds
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/basic-auth'
    })
  }) 
)

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);


// 👇 Start handling routes here
const index = require('./routes/index');
const auth = require('./routes/auth');
const main = require('./routes/main');
const private = require('./routes/private');
app.use('/', index);
app.use('/auth', auth);
app.use('/main', main);
app.use('/private', private);
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

