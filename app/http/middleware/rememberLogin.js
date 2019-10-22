// baraye yadavariye vorod
const User =  require('app/models/user');
const middleware = require ('./middelware');

class rememberLogin extends middleware  {
   // faghat vaghti karbar login nakarde in ejra she 
   handle(req,res,next){
       if(! req.isAuthenticated()){
           const rememberToken = req.signedCookies.remember_token;
           if(rememberToken) return this.userFind(rememberToken,req,next);
       }

       next();
   }
    
   userFind(rememberToken,req,next){
          User.findOne({rememberToken : rememberToken})
              .then(user=>{
                if(user)  {
                 req.logIn(user,err=>{
                     if(err) next(err);
                     next();
                });
           } else 
               next();
        })
       .catch(err =>{
       next(err);
    });

   }

}


module.exports = new rememberLogin();