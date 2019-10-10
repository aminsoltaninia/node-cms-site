const controller = require('app/http/controllers/controler');






class registerControler extends controller{// hala in erthbari mikone az controller asli
    showRegistrationForm(req,res){
        const errors = req.flash('errors');
        console.log(errors);
        res.render('auth/register.ejs',{ messages : errors});//esme fili ke mikhim neshon bedimo mizarim
    }
    // registerProccess(req,res,next){
       
    //    req.checkBody('name','فیلد نام نمی تواند خالی باشد').notEmpty();
    // //    req.checkBody('name','فیلد نام نمی تواند کمتر از 5 کرکتر باشد').isLength({min:5});
    // //    req.checkBody('email','فیلد ایمیل نمی تواند خالی باشد').notEmpty();
    // //    req.checkBody('email','فیلد ایمیل  باشد').isEmail();
    // //    req.checkBody('password','فیلد پسورد نمی تواند خالی باشد').notEmpty();
    // //    req.checkBody('name','پسورد کمتر از 8 کرکتر نباشد').isLength({min:8});
       

    //    req.getValidationResult()
    //        .then(result=>{
    //             const errors = result.array();// age error bashe array mikone
    //             res.json(errors);
    //         })   
    //        .catch(err=> console.log(err)) 
    // }

}






module.exports = new registerControler();