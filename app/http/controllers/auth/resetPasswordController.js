const controller = require('app/http/controllers/controller');
const passport = require('passport');
const PasswordReset = require('app/models/password-reset');
const User = require('app/models/user');
const uniqueString = require('unique-string');

class forgotPasswordController extends controller {
    
    showResetPassword(req , res) {
        const title = 'بازیابی رمز عبور';
        res.render('home/auth/passwords/reset' , 
                {
                recaptcha : this.recaptcha.render() ,
                 title ,
                token:req.params.token});// inja token ke ijad shode ro ersal mikonim be reset.ejs
    }

    async reserPasswordProccess(req  ,res , next) {
        await this.recaptchaValidation(req , res);

        let result = await this.validationData(req);

                if(result){
                    return  this.resetPassword(req, res);
                } 
                
                return this.back(req,res);
                  
    }

    async resetPassword(req ,res ) {
        //console.log(req.body.email);
        //console.log(req.body.token);
        let field = await PasswordReset.findOne({ $or: [ { email : req.body.email } , { token : req.body.token } ]});
         console.log(`result is : ${field }`);
        if (! field){
           req.flash('errors','اطلاعات وارد شده صحیح نیست'); 
           return this.back(req,res);
        }

        if(field.use){
            req.flash('errors','از این لینک برای بازیابی قبلا استفاده شده')
            return this.back(req,res);
        }

        // age user ba email va token mojodbood

        let user = await User.findOneAndUpdate({email : field.email},{$set : {password : req.body.password}});
         // update dont true
        if (!user){
            req.flash('errors','آپدیت انجام نشد');
            return this.back();
        }
        
        //for repid password
        await field.update({use : true});
        return res.redirect('/auth/login');

    }

}

module.exports = new forgotPasswordController();