const router = require("express").Router();
const isLoggedIn = require('../middlewares');

router.get('/', isLoggedIn, async (req, res, next) => {
    res.render('main');
  });


module.exports = router;