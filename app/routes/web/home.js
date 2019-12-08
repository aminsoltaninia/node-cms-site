


const express = require('express');
const router = express.Router();

// controller
const homeController = require('app/http/controllers/homeController');
const courseController = require('app/http/controllers/courseController');

// validator
const commentValidator = require('app/http/validators/commentValidator')

// middlewares
const redirectINotfAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');


router.get('/logout' , (req ,res) => {
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});

// Home Routes
router.get('/' , homeController.index);
router.get('/courses' , courseController.index);
router.get('/about-me' , homeController.aboutme);
router.get('/courses/:course' , courseController.single);
router.post('/comment',redirectINotfAuthenticated.handle,commentValidator.handle(),homeController.comment)
router.get('/download/:episode' , courseController.download);

module.exports = router;