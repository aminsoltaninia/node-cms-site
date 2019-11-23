const controller = require('app/http/controllers/controller');
const Course = require ('app/models/course')

class homeController extends controller {
    
    async index(req , res) {
        let courses = await Course.find({}).sort({ createdAt : 1}).limit(8).exec();
        res.render('home/index',{courses});
    }
    
    async aboutme(req , res) {
        res.render('home/about');
    }
}

module.exports = new homeController();