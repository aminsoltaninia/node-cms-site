const express = require('express');
const router = express.Router();

// controllers
const homeControler = require('app/http/controllers/homeControler');

const loginControler = require('app/http/controllers/auth/loginControler');
const registerControler = require('app/http/controllers/auth/registerControler');










// Home route

router.get('/',homeControler.index);// be class homecontroler va tabe index ejra mishe
router.get('/login',loginControler.showLoginForm);
router.get('/register',registerControler.showRegistrationForm);










module.exports = router;