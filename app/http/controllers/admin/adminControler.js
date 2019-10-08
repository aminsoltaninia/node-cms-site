const controler = require('./../controler');



class indexControler extends controler{
    index(req,res){
        res.json('admin Page');
    }
    courses(req,res){
        res.json('course page');
    }
}







module.exports = new indexControler();