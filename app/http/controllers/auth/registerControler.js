const controller = require('app/http/controllers/controler');






class registerControler extends controller{// hala in erthbari mikone az controller asli
    showRegistrationForm(req,res){
        res.render('auth/register.ejs');//esme fili ke mikhim neshon bedimo mizarim
}

}






module.exports = new registerControler();