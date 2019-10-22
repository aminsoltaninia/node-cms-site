// baraye yadavariye vorod
const User =  require('app/models/user');
const middleware = require ('./middelware');

class redirectIfAuthenticated extends middleware  {
   // faghat vaghti karbar login nakarde in ejra she 
   handle(req,res,next){
       if( req.isAuthenticated()) return res.redirect('/');// agar login karde bashe dige neshon nemide

       next();
   }
    
 
}


module.exports = new redirectIfAuthenticated();