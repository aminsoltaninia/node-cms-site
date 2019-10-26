
const autoBind = require('auto-bind');
const {validationResult} = require('express-validator');
const Recaptcha = require('express-recaptcha').RecaptchaV2;




class controler {

   constructor(){
      
      autoBind(this);// kalameye this ro bind mikonim be ar methodi ke vojod dare
      this.recaptcha = new Recaptcha(config.service.recaptcha.client_key,config.service.recaptcha.secret_key ,{...config.service.recaptcha.option});
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
   async validationData(req)  {
      const result = validationResult(req);
      if (!result.isEmpty()){
          const errors = result.array();
          const message = [];
          //console.log(errors);
          for(var i=0;i<(errors.length);i++){
             message.push(errors[i].msg);
          }
          
          req.flash('errors',message);
          return false;
   
     }
     return true;
   } 
   
}
    

module.exports =  controler;