const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');

class courseController extends controller {
    
    async index(req , res) {
        res.render('home/courses');
    }
   
    async single(req,res){
        console.log(req.params);
        console.log(req.params.course);
        let course = await Course.findOne({slug : req.params.course}) 
                                 .populate([
                                     {
                                      path : 'user' ,
                                      select:'name'
                                    },
                                    { 
                                      path : 'episodes'
                                    }]);
        return res.json(course);
        res.render('home/single-course');
    }
}

module.exports = new courseController();