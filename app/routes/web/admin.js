const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controllers/admin/adminController');

const courseController = require('app/http/controllers/admin/courseController');

// validator
const courseValidator = require('app/http/validators/courseValidator');




// for chnage master page

router.use((req,res,next)=>{
    
    res.locals.layout = "admin/master";
    
    next();
})

// Admin Routes
router.get('/' , adminController.index);
router.get('/courses' , courseController.index);
router.get('/courses/create',courseController.create);
router.post('/courses/create',courseValidator.handle(),courseController.store);

module.exports = router;