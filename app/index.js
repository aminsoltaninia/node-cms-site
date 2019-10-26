const express = require('express');
const app = express();
const _ = require('lodash');
const http = require('http');// 0.shoro mikonim be inke be server vaslkonim site ro . ye raveshe dige


// baraye inke be etellaate dakele body marboot req va res dastresi peyda konim body parser mikhaim 
const bodyParser = require('body-parser');
const coockeiParser = require('cookie-parser');

const { check, validationResult } = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session'); 
const mongoose = require('mongoose');
const passport = require('passport');
const Helpers = require('./helpers');



const rememberLogin = require('app/http/middleware/rememberLogin');






module.exports = class Application {
    constructor(){
       
        this.setupExpress();// 1.tabe minvisim 
        this.setMongoConnection();
        this.setConfig();
        this.setRouters();


    }    

    setupExpress(){
       const server = http.createServer(app);// 3. app ro be server moarefi mikonim
       server.listen(config.port,()=>{// 4 . cerate port
           console.log(`Listenin on port ${config.port}`);
       });
    }
     
    setMongoConnection(){
       mongoose.Promise = global.Promise ;// estefade az Promis global va copy kardanesh to Promis mongoos
       mongoose.connect(config.database.url);// url marboor be mongodb ro moarefi mikonim  
       // bejaye localhost mishe port gharar begire

    } 




    setConfig(){// baraye filehaye public. static file (css js image , ..)
        // rout file public ro be express moarefi mikonim
       
      require('app/passport/passport-local.js'); 
       
      app.use(express.static(config.layout.public_dir));//in baraye emale midleware hast/inja static path ro behesh moarefi mikonim
       
       // hala express engine ro set mikonim
      app.set('view engine',config.layout.view_engine);// packaje ejs ro nasb mikonim
      
      // express ejs 
      app.use(config.layout.ejs.expressLayouts);
      app.set("layout extractScripts",config.layout.ejs.extractScripts) ;//baraye azafe kardane tage script
      app.set("layout extractStyles",config.layout.ejs.extractStyles);//baraye ezafe kardane style
      app.set("layout",config.layout.ejs.master );
       //bad az set view wngn rout maroor be view ro miarefi mikonim
      app.set('views',config.layout.view_dir)
    
       // farakhaniye body parser
       app.use(bodyParser.json());// be sorate JSON mide etelaat ro injoori
       app.use(bodyParser.urlencoded({extended:true}));

       // validation information 
       //app.use(check);
       //app.use(validationResult);
       //console.log(check());
       



       // estefade az session 
       app.use(session({...config.session})) ;

       // farakhoniye koockei parser
       app.use(coockeiParser(config.cookie_secretkey)) ;

       // flash message
       app.use(flash());
    
       app.use(passport.initialize());// for use passport
       app.use(passport.session());
        
       app.use(rememberLogin.handle);


       // baraye inke vaghti ye user login mikone bere to page asli vali dige login va ozviyat ro nayare

       app.use((req,res,next)=>{
          app.locals = new Helpers(req,res).getObjects();
          next();
       })





    
    }
    
    // morafiye router ha 
    setRouters(){
       app.use(require('app/routes/api/index')) ;
       app.use(require('app/routes/web/index')) ;
    }
    
}

