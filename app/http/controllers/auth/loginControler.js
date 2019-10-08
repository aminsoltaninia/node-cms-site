const controller = require('app/http/controllers/controler');






class loginControler extends controller{// hala in erthbari mikone az controller asli
    showLoginForm(req,res){
        res.render('auth/login.ejs');//esme fili ke mikhim neshon bedimo mizarim
}

}






module.exports = new loginControler();