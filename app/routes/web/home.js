const express = require('express');

//const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const coockeiParser = require('cookie-parser');

const { check, validationResult } = require('express-validator');

// controllers
const homeControler = require('app/http/controllers/homeControler');

const loginControler = require('app/http/controllers/auth/loginControler');
const registerControler = require('app/http/controllers/auth/registerControler');


// Middlewares
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');







// Home route

router.get('/',homeControler.index);// be class homecontroler va tabe index ejra mishe

router.get('/login',redirectIfAuthenticated.handle,loginControler.showLoginForm);// redirectIfAuthenticated.handle nemizare useri ke login karde bere to login va register
router.post('/login',redirectIfAuthenticated.handle,[
   
      // // username must be an email
      
      check('email','فیلد ایمیل  باشد').isEmail(),
      // password must be at least 5 chars long
      check('password','پسورد کمتر از 8 کرکتر نباشد').isLength({ min: 8 })
      
      ],(req, res,next) => {
            loginControler.recaptchaValidation(req,res)
                .then(result =>{
                       // Finds the validation errors in this request and wraps them in an object with handy functions
                       const errors = validationResult(req).array();
                       var message = [];
                       //console.log(errors);
                       for(var i=0;i<(errors.length);i++){
                             message.push(errors[i].msg);
                       }
                       // console.log(message);
                        //console.log(errors.isEmpty());
                       if (!errors.length == 0) {
                                //res.status(422).json({ errors: errors.array() });
                               //res.json('show register error');
                                req.flash('errors',message);
                                res.redirect('/login');
                      }
                      else {
                          //res.json(req.body); 
                          loginControler.login(req,res,next);
                      }
                })
                .catch(err => console.log(err));
                
});

router.get('/register',redirectIfAuthenticated.handle,registerControler.showRegistrationForm);
//baraye rejister link post morefi mikonim ta bad az ozviyat bere be in method =>Post
// router.post('/register',registerControler.registerProccess);
router.post('/register' ,redirectIfAuthenticated.handle,[
   
    check('name','فیلد نام نمی تواند خالی باشد').not().isEmpty(),
    check('name','فیلد نام نمی تواند کمتر از 5 کرکتر باشد').isLength({min:5}),
    
    // // username must be an email
    check('email','فیلد ایمیل نمی تواند خالی باشد').not().isEmpty(),
    check('email','فیلد ایمیل  باشد').isEmail(),
    
    // password must be at least 5 chars long
    check('password','فیلد پسورد نمی تواند خالی باشد').not().isEmpty(),
    check('password','پسورد کمتر از 8 کرکتر نباشد').isLength({ min: 8 })
    
    ],(req, res,next) => {
          registerControler.recaptchaValidation(req,res)
              .then(result =>{
                     // Finds the validation errors in this request and wraps them in an object with handy functions
                     const errors = validationResult(req).array();
                     var message = [];
                     //console.log(errors);
                     for(var i=0;i<(errors.length);i++){
                           message.push(errors[i].msg);
                     }
                     // console.log(message);
                      //console.log(errors.isEmpty());
                     if (!errors.length == 0) {
                              //res.status(422).json({ errors: errors.array() });
                             //res.json('show register error');
                              req.flash('errors',message);
                              res.redirect('/register');
                    }
                    else {
                        //res.json(req.body); 
                        registerControler.registerProccess(req,res,next);
                    }
              })
              .catch(err => console.log(err));
              
              
              
          
          
          
          
          
        //       registerControler.recaptcha.verify(req,(err,data)=>{
        //   if (err){
        //      console.log(err);
        //      res.json('error');
        //   }
        //   else{
               
        //       // Finds the validation errors in this request and wraps them in an object with handy functions
        //      const errors = validationResult(req).array();
        //      var message = [];
        //      //console.log(errors);
        //      for(var i=0;i<(errors.length);i++){
        //       message.push(errors[i].msg);
        //      }
        //      // console.log(message);
        //      //console.log(errors.isEmpty());
        //     if (!errors.length == 0) {
        //     //res.status(422).json({ errors: errors.array() });
        //     //res.json('show register error');
        //         req.flash('errors',message);
        //         res.redirect('/register');
              
        //     }
        //     else {
        //        res.json(req.body); 
        //     }
        //   }
       
            
        // }) 
});



router.get('/logout',(req,res)=>{// for more information : http://passposrjs.com
      req.logout(); 
      res.clearCookie('remember_token');//baraye hazfe cooki vaghti exit mizane user
      res.redirect('/');
})







            
module.exports = router;