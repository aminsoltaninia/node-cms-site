const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');


class indexController extends controller {
    index(req , res) {
        res.render('admin/courses/index',{title : 'دوره ها'});
    }

    create(req,res){
        res.render('admin/courses/create',{title: 'ایجاد دوره'});
    }

    async store(req,res){
        let status = await this.validationData(req);

        if(!status){

           return this.back(req,res);
        }
         
        
        
            // images 
        
            // create course

            let images = req.body.images; // az tage image ke name on ro images estefade kardim migirim dakhele create.ejs

            let { title , body , type , price , tags } = req.body;
        
            let newCourse = new Course({
              user : req.user._id,
              title  ,
              slug : this.slug(title),
              body  ,
              type ,
              price ,
              images,
              tags 
            })
            // console.log(newCourse);
            await newCourse.save();
        

        return res.redirect('/admin/courses');
    }


    slug(title){
        return title.replace(/([^0-9a-z0-9آ-یA-Z]|-)+/g,"-");
    }
}

module.exports = new indexController();