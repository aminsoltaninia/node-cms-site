const controller = require('app/http/controllers/controller');
const passport = require('passport');
const PasswordReset = require('app/models/password-reset');
const User = require('app/models/user');
const uniqueString = require('unique-string');

class forgotPasswordController extends controller {
    
    showForgotPassword(req , res) {
        const title = 'فراموشی رمز عبور';
        res.render('home/auth/passwords/email' , { recaptcha : this.recaptcha.render() , title });
    }

    async sendPasswordResetLinl(req  ,res , next) {
        await this.recaptchaValidation(req , res);

        let result = await this.validationData(req);

                if(result){
                    return  this.sendResetLink(req, res);
                }     
                
                return this.back(req,res);

                  
    }

    async sendResetLink(req ,res ) {
        let user = await User.findOne({email : req.body.email});
        //return res.json(user)
        if(!user){// user nist
            req.flash('errors','چنین کاربری وجود ندارد');
            return this.back(req,res);
        }
        // age user bashe token iijad she

        const newPasswordReset = new PasswordReset({
             email : req.body.email,
             token : uniqueString(),// token monhaser befard 
        });

        // save token 

         await  newPasswordReset.save();

        // send mail

        
        req.flash('success',' بازیابی رمز عبور با موفقیت  انجام شد');
        res.redirect('/');
    }

}

module.exports = new forgotPasswordController();