const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Category = require('app/models/category')
const fs = require('fs');
const sharp = require('sharp');
const path=require('path');
class courseController extends controller {
    async index(req , res) {
        try {
            //let courses = await Course.find({}).sort({createdAt:1});// a akhar be aval . -1 az aval be akhar 
            let page = req.query.page || 1;// age pagi  nabood 1 ro bargardoe
            //console.log(page);
            let courses = await Course.paginate({},{page,sort:{createdAt:1},limit : 20});
            res.render('admin/courses/index',{title : 'دوره ها',courses});
        } catch (error) {
            
            next(error);
        }
    }

    async create(req , res) {
        let categories = await Category.find({});

        res.render('admin/courses/create' , { categories });        
    }

    async store(req,res,next){
        try {
            let status = await this.validationData(req);
            //console.log(req.file);
        
            if(!status){
              if (req.file)// age file name iamge vojod dasht
                fs.unlinkSync(req.file.path);// baes mish age rror dasht form image pak she
           
            return this.back(req,res);
            }
         
            // create course

           let images = this.imageResize(req.file); // az tage image ke name on ro images estefade kardim migirim dakhele create.ejs

           let { title , body , type , price , tags , lang } = req.body;
        
           let newCourse = new Course({
              user : req.user._id,
              title  ,
              slug : this.slug(title),
              body  ,
              type ,
              price ,
              images ,
              thumb:images[480],
              tags ,
              lang
           })
            // console.log(newCourse);
           await newCourse.save();
        

           return res.redirect('/admin/courses');
        } catch (error) {
            
            next(error);
        }
    }
    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let course = await Course.findById(req.params.id);
            if( ! course ) this.error('چنین دوره ای وجود ندارد' , 404);
            
            req.courseUserId = course.user;

            console.log(req.courseUserId)
            if( !req.userCan('access edit-course page')){
                this.error('شما اجازه دسترسی به این صفحه را ندارید ', 403)
            }

            let categories = await Category.find({});
            return res.render('admin/courses/edit' , { course , categories });
        } catch (err) {
            next(err);
        }
    }


    async update(req,res,next){
        
       try {
        let status = await this.validationData(req);
        if(!status){
           if (req.file)// age file name iamge vojod dasht
              fs.unlinkSync(req.file.path);// baes mish age rror dasht form image pak she
           
           return this.back(req,res);
        }
        let objectForUpdate ={};
        //set image thumb
        objectForUpdate.thumb = req.body.imagesThumb;
        // chek img
        if(req.file){
            objectForUpdate.images = this.imageResize(req.file);
            objectForUpdate.thumb = objectForUpdate.images[480];
        } 
        delete req.body.images;
        objectForUpdate.slug = this.slug(req.body.title);
        console.log({...req.body , ...objectForUpdate});
        await Course.findByIdAndUpdate(req.params.id , {$set : {...req.body , ...objectForUpdate}})// ...req.body  ... baes mishe azaye ye object kamel bere toye objecte dige
          
        return res.redirect('/admin/courses');
       } catch (error) {
           
           next(error);
       }

       
    }

    async destroy(req,res,next){
         try {
            this.isMongoId(req.params.id);
            
            let course = await Course.findById(req.params.id).populate('episodes').exec();
            if(!course) this.error('  چنین دوره وحود ندارد  ',404);
                
            
            // delete episodes
            course.episodes.forEach(episode => episode.remove())
            // delete iamges
         
            Object.values(course.images).forEach(image => fs.unlinkSync(`./public${image}`));//delete all courses images
            //delete course

            course.remove() ;

            // at the end 
        
            return res.redirect('/admin/courses'); 
        } catch (error) {
            
             next(error);
         }
    }

    imageResize(image){
         const imageInfo = path.parse(image.path);// gereftane name va pasvande image
        //console.log(imageInfo);
         let addressImages = {};
         addressImages['original']=this.getUrlImage(`${image.destination}/${image.filename}`);//dakhele property original adres marboot be image ro mizarim
       // console.log(addressImages);
        
        const resize = size =>{

            //esm gozariye file
            let imageName = `${imageInfo.name}-${size}${imageInfo.ext}`;
           
            addressImages[size] = this.getUrlImage(`${image.destination}/${imageName}`);          
            sharp(image.path)
                  .resize(size,null)// arz va tool tanzim mishe
                  .toFile(`${image.destination}/${imageName}`);// directory jaii ke zakhire mishe ro mige
        }
      
        Promise
          .all([1080,720,480].map(resize))
          .then(file=>{});


        return addressImages;   
    }
    
    getUrlImage(dir){
        return dir.substring(8) ;// => use substring(8)=> ./amin/leila.substring(8) => ./leila 
    }

    slug(title){
        return title.replace(/([^0-9a-z0-9آ-یA-Z]|-)+/g,"-");
    }
}

module.exports = new courseController();