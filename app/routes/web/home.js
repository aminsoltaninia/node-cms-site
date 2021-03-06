


const express = require('express');
const router = express.Router();

// controller
const homeController = require('app/http/controllers/homeController');
const courseController = require('app/http/controllers/courseController');
const userController = require('app/http/controllers/userController');

// validator
const commentValidator = require('app/http/validators/commentValidator')

// middlewares
const redirectINotfAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');
const convertFileToField = require('app/http/middleware/convertFileToField')


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
router.post('/courses/payment' ,redirectINotfAuthenticated.handle ,courseController.payment);
router.get('/courses/payment/checker' , redirectINotfAuthenticated.handle , courseController.checker )
router.post('/comment',redirectINotfAuthenticated.handle,commentValidator.handle(),homeController.comment)
router.get('/download/:episode' , courseController.download);

router.get('/user/panel' , userController.index);
router.get('/user/panel/history' , userController.history);
router.get('/user/panel/vip' , userController.vip);
router.post('/user/panel/vip/payment' , userController.vipPayment);
router.get('/user/panel/vip/payment/check' , userController.vipChekPayment);


/// sitemap router

router.get('/sitemap.xml' , homeController.sitemap);

// feed router

router.get('/feed/courses' , homeController.feedCourses);
router.get('/feed/episodes' , homeController.feedEpisodes);


// Ajax router
  // Helpers 
const upload = require('app/helpers/uploadImage');
const gate = require('app/helpers/gate');


router.get('/ajaxupload' , (req,res,next) => res.render('home/ajaxupload'));
router.post('/ajaxupload' ,upload.single('photo'), convertFileToField.handle ,(req,res,next) => {
    try {
        
        res.json({ ... req.body , ... req.file  })

    } catch (error) {
        next(error)
    }
}
);

module.exports = router;