const express = require('express');
const app = express();
const _ = require('lodash');
const http = require('http');// 0.shoro mikonim be inke be server vaslkonim site ro . ye raveshe dige
const path = require('path');// path native nodejs hast

// baraye inke be etellaate dakele body marboot req va res dastresi peyda konim body parser mikhaim 
const bodyParser = require('body-parser');
const coockeiParser = require('cookie-parser');

const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);//session ro to mongodb zakhire mikonim 
const mongoose = require('mongoose');
const passport = require('passport');








module.exports = class Application {
    constructor(){
       
        this.setupExpress();// 1.tabe minvisim 
        this.setMongoConnection();
        this.setConfig();
        this.setRouters();


    }    

    setupExpress(){
       const server = http.createServer(app);// 3. app ro be server moarefi mikonim
       server.listen(3000,()=>{// 4 . cerate port
           console.log('Listenin on port 3000');
       });
    }
     
    setMongoConnection(){
       mongoose.Promise = global.Promise ;// estefade az Promis global va copy kardanesh to Promis mongoos
       mongoose.connect('mongodb://localhost/nodejscms');// url marboor be mongodb ro moarefi mikonim  
       // bejaye localhost mishe port gharar begire

    } 




    setConfig(){// baraye filehaye public. static file (css js image , ..)
        // rout file public ro be express moarefi mikonim
       app.use(express.static('public'));//in baraye emale midleware hast/inja static path ro behesh moarefi mikonim
       
       // hala express engine ro set mikonim
       app.set('view engine','ejs');// packaje ejs ro nasb mikonim
       

       //bad az set view wngn rout maroor be view ro miarefi mikonim
       app.set('views',path.resolve('./resource/views'))
    
       // farakhaniye body parser
       app.use(bodyParser.json());// be sorate JSON mide etelaat ro injoori
       app.use(bodyParser.urlencoded({extended:true}));

       // validation information 
       //app.use(check);
       //app.use(validationResult);
       //console.log(check());
       



       // estefade az session 
       app.use(session({
          secret:'mysecretkey',
          resave:true,
          saveUninitialized:true,
          store: new MongoStore({ mongooseConnection : mongoose.connection}) //mahale zakhire saziye session
       })) ;

       // farakhoniye koockei parser
       app.use(coockeiParser('mysecretkey')) ;

       // flash message
       app.use(flash());
    
       







    
    }
    
    // morafiye router ha 
    setRouters(){
       app.use(require('app/routes/api/index')) ;
       app.use(require('app/routes/web/index')) ;
    }
    
}
