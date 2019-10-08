const controller = require('./controler');






class homeControler extends controller{// hala in erthbari mikone az controller asli
    index(req,res){
        res.render('home.ejs');//esme fili ke mikhim neshon bedimo mizarim
}

}






module.exports = new homeControler();