const passport = require('passport');
const localStrategy = require('passport-local').Strategy;// az class dahelesh estefe mikonim baraye inke system ba asas email va pass faal she
const User = require('app/models/user');




// baraye inke karbar login bemone va nakhad harbar login kone 
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
});

// yestrategy ham khodemon mizarim roosh
// az passport local ino peyda mikonim
passport.use('local.register',new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback: true   // req ro be callbackemon pas midim 
},(req,email,password,done)=>{// miyad chek mikone ke aya karbar jozve karbarane ma hast ya na
    console.log(email,password);
    User.findOne({'email':email},(err,user)=>{
        if(err) return done(err);
        if(user) return done(null,false,req.flash('errors','User already registered '))// parametr aval mige eror nist . par 2 mige age user vojod dasht dige dobare regsiter nashe
        //


        // age user register nakarde bood ghablan 
        const newUser = new User ({
             name : req.body.name ,
             email ,
             password// ecs5 estefade mikonim va niaz be meghdar dehiye email va pass nist 
        });
        // save to mongoDB
        newUser.save(err =>{
            if(err) return done(err,false,req.flash('errors',' registration dont complete , please try agin '));
            // vaghti hich errori nist 
            done(null,newUser);
        })
    })
}))