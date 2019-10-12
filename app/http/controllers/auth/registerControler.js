const controller = require('app/http/controllers/controler');
const Recaptcha = require('express-recaptcha').RecaptchaV2;





class registerControler extends controller{// hala in erthbari mikone az controller asli
    
    constructor(){
        super();
        this.recaptcha = new Recaptcha('6LdlNb0UAAAAAIDD7l650KPJiC07HhW095We4W1G', '6LdlNb0UAAAAAPSwu98HNdgZhvXBIH1FCr7Ve2tj',{callback:'cb',hl:'fa'});
    }

    showRegistrationForm(req,res){
        
        const errors = req.flash('errors');
        console.log(errors);
        res.render('auth/register.ejs',{ messages : errors , recaptcha : this.recaptcha.render()});//esme fili ke mikhim neshon bedimo mizarim
    }
    recaptchaValidation(req,res){
       return new Promise((resolve,reject)=>{
           
        this.recaptcha.verify(req,(err,data)=>{
            if (err){
                req.flash('errors',' security option is OFF !!!  please accept reCAPTCHA and try again ');
                res.redirect(req.url);// ba in dastor az harjaii omade mire hamon safe masalan az login age omae mmire login
             } else resolve(true); 
             
         })
       }) 
       
     }
  
}






module.exports = new registerControler();