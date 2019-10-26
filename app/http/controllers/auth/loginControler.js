const controller = require('app/http/controllers/controler');


const passport = require('passport');



class loginControler extends controller{// hala in erthbari mikone az controller asli
    
   
    showLoginForm(req,res){
        const title = 'صفحه ورود';
        const Errors = req.flash('errors');
        console.log(Errors);
        res.render('home/auth/login.ejs',{ errors : Errors , recaptcha : this.recaptcha.render(),title});//esme fili ke mikhim neshon bedimo mizarim
    }   


    loginProcess(req,res,next) {
        this.recaptchaValidation(req,res)
            .then(result => this.validationData(req))
            .then(result =>{
                if(result) this.login(req,res,next)
                else res.redirect('/login');
            }) 
            .catch(err => console.log(err));
    }

    login(req,res,next){
        passport.authenticate('local.login',(err, user)=>{
            // user isnt exist

            if (!user) return res.redirect('/login');
            
            // user is exist

            req.logIn(user,err =>{
                  if(req.body.remember){
                      // set token
                      console.log('set token');
                      user.setRememberToken(res);
                  }
                  return res.redirect('/');
            })
        })(req,res,next);// ba ezafe kardane in optionha kare mofidtari angam mide ta halate defult 
        


    }

}






module.exports = new loginControler();