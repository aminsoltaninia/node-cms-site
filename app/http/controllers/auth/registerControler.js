const controller = require('app/http/controllers/controler');

const passport = require('passport');





class registerControler extends controller{// hala in erthbari mikone az controller asli
    
    

    showRegistrationForm(req,res){
        const title = 'صفحه عضویت';
        const Errors = req.flash('errors');
        console.log(Errors);
        res.render('home/auth/register.ejs',{ errors : Errors , recaptcha : this.recaptcha.render(),title});//esme fili ke mikhim neshon bedimo mizarim
    }
  
     registerProcess(req,res,next){
         this.recaptchaValidation(req,res)
             .then(result=> this.validationData(req)) 
             .then(result=>{
                 if(result) this.register(req,res,next)
                 else res.redirect('/register');
             })
             .catch(err => console.log(err));
     }
  
     register(req,res,next){
             passport.authenticate('local.register',{// strategy ke khodemon mikhim roosh bearim 
                 successRedirect : '/',// age okmbood boro safeye asli
                 failureRedirect : '/register',
                 failureFlash : true // age bekhaim etelaat ro be sorate flash message ersal knim
             })(req,res,next);// ba ezafe kardane in optionha kare mofidtari angam mide ta halate defult 
     }
  
}






module.exports = new registerControler();