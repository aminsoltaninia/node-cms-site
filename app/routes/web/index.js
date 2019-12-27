const express = require('express');
const router = express.Router();
const i18n = require("i18n");
// middle ware
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');
const redirectIfNotAdmin = require('app/http/middleware/redirectIfNotAdmin');
const  errorHandller =  require ('app/http/middleware/errorHandller');

router.use((req , res , next) =>{
    try {
        let lang = req.signedCookies.lang;
        console.log(i18n.getLocale());

        if(i18n.getLocales().includes(lang)) {
            req.setLocale(lang)
        }else // for set defualt
            req.setLocale(i18n.getLocale());// set default
        next();
    } catch (error) {
        next(error)
    }
})

/// language router

router.get('/lang/:lang' , (req , res ) =>{
     let lang = req.params.lang ; 
     if(i18n.getLocales().includes){
        res.cookie('lang' , lang , { maxAge : 1000*60*60*24*90 , signed : true } );// 90 days cookie// singed : true for ramsnegari
     }

     res.redirect(req.header('Referer') || '/'); 
})


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