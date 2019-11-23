const express = require('express');
const router = express.Router();

// middle ware
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');
const redirectIfNotAdmin = require('app/http/middleware/redirectIfNotAdmin');
const  errorHandller =  require ('app/http/middleware/errorHandller');
// Admin Router
const adminRouter = require('app/routes/web/admin');
router.use('/admin' ,redirectIfNotAdmin.handle,adminRouter);


// Home Router
const homeRouter = require('app/routes/web/home');
router.use('/' , homeRouter);


// auth router
const authRouter = require('app/routes/web/auth');
router.use('/auth',redirectIfAuthenticated.handle,authRouter);



// Handle Errors
router.all('*',errorHandller.error404);
router.use(errorHandller.handller)







module.exports = router;