const autoBind = require('auto-bind');
const Recaptcha = require('express-recaptcha').RecaptchaV2;
const { validationResult } = require('express-validator');
const isMongoId = require('validator/lib/isMongoId');
const  sprintf = require('sprintf-js').sprintf;
module.exports = class controller {
    constructor() {
        autoBind(this);
        this.recaptchaConfig();
    }

    recaptchaConfig() {
        this.recaptcha = new Recaptcha(
            config.service.recaptcha.clinet_key,
            config.service.recaptcha.secret_key , 
            {...config.service.recaptcha.options}
        );
    }

    recaptchaValidation(req , res) {
        return new Promise((resolve , reject) => {
            this.recaptcha.verify(req , (err , data) => {
                if(err) {
                   // console.log(req.url , req.originalUrl);
                    req.flash('errors' , 'گزینه امنیتی مربوط به شناسایی روبات خاموش است، لطفا از فعال بودن آن اطمینان حاصل نمایید و مجدد امتحان کنید');
                    this.back(req,res);
                } else resolve(true);
            })
        })
    }

    async validationData(req) {
        const result = validationResult(req);
        if (! result.isEmpty()) {
            const errors = result.array();
            console.log(errors);
            const messages = [];
           
            errors.forEach(err => messages.push(err.msg));
            console.log(messages);
            req.flash('errors' , messages)

            return false;
        }

        return true;
    }
    back(req,res){

        req.flash('formData', req.body);

        return res.redirect(req.header('Referer')|| '/');
    }

    isMongoId(paramId){
        if(!isMongoId(paramId)){

           this.error('ای دی وارد شده صحیح نیست',404)
            
        }
    }

    error(message,status = 500){
        let error = new Error(message)
            error.status = status;
            throw error;
    }



     getTime(episodes){
       let second = 0 ;

       episodes.forEach(episode =>{
           let time = episode.time.split(":");
           if(time.length === 2){ // format time => 25:50
              second+= parseInt(time[0])*60;
              second+= parseInt(time[1]);
           }else if(time.length === 3 ){// format time => 01 : 25 : 50
               second+= parseInt(time[0])*60*60;
               second+= parseInt(time[1])*60;
               second+= parseInt(time[2]);
           }
       })
       // generate minutes from second

       let minutes = Math.floor(second/60);// be oaiin round mikone
       
       let hours = Math.floor(minutes/60);
       
       minutes -= hours * 60 ;

       second = Math.floor(((second/60)%1) * 60 );

       // 1:4:45 => 01:02:45
       //console.log(sprintf('%02d:%02d:%02d',hours,minutes,second));
       return sprintf('%02d:%02d:%02d',hours,minutes,second);
    }

    alert(req, data ) {

       let title = data.title || '',
           message = data.message || '',
           typeIcon = data.type || 'info',
           button = data.button || null ,
           timer = data.timer || 2000 ;
        
       req.flash('sweetalert' , { title , message , typeIcon , button , timer})    

    }

    alerAndBack( req , res , data ){
        this.alert(req,data);
        this.back(req,res);
    }


}