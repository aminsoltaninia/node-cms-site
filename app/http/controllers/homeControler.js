const controller = require('./controler');






class homeControler extends controller{// hala in erthbari mikone az controller asli
    index(req,res){
        // passport baes mishe ke etelaat vorodi age dorost bashe bere dakhele req va behesh dastresi peyda konim behs 
        res.render('home');//res.render('home.ejs');//esme fili ke mikhim neshon bedimo mizarim
}

}






module.exports = new homeControler();