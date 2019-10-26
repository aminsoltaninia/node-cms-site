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


// validators
const registerValidator = require('app/http/validators/registerValidator');
const loginValidator = require('app/http/validators/loginValidator');




// Home route

router.get('/',homeControler.index);// be class homecontroler va tabe index ejra mishe

router.get('/login',redirectIfAuthenticated.handle,loginControler.showLoginForm);// redirectIfAuthenticated.handle nemizare useri ke login karde bere to login va register
router.post('/login',redirectIfAuthenticated.handle,loginValidator.handle(),loginControler.loginProcess);

router.get('/register',redirectIfAuthenticated.handle,registerControler.showRegistrationForm);
router.post('/register' ,redirectIfAuthenticated.handle,registerValidator.handle(),registerControler.registerProcess);



router.get('/logout',(req,res)=>{// for more information : http://passposrjs.com
      req.logout(); 
      res.clearCookie('remember_token');//baraye hazfe cooki vaghti exit mizane user
      res.redirect('/');
})







            
module.exports = router;