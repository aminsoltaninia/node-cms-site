
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);//session ro to mongodb zakhire mikonim 
const mongoose = require('mongoose');


module.exports = {// marboot be cooki hast
    secret:process.env.SESSION_SECRETKEY,
    resave:true,
    saveUninitialized:true,

    cookie:{expires :new Date(Date.now()+ 1000*60*60*24*5)},
    // expire cooki ro tnsim mikonim// alan baraye 5roz gozashtim //  hata age server down beshe  va dobre biyad bala bazam login mimone ta session expire she

    store: new MongoStore({ mongooseConnection : mongoose.connection}) //mahale zakhire saziye session
 }