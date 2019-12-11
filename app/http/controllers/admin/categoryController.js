const controller = require('app/http/controllers/controller');

const Category = require('app/models/category');
const fs = require('fs');
const sharp = require('sharp');
const path=require('path');
class categoryController extends controller {
    
    async index(req , res) {
         
        try {
            //let courses = await Course.find({}).sort({createdAt:1});// a akhar be aval . -1 az aval be akhar 
            let page = req.query.page || 1;// age pagi  nabood 1 ro bargardoe
            //console.log(page);
            let categories = await Category.paginate({},{page,sort:{createdAt:1},limit : 20 , populate : 'parent' });
            //return res.json(categories);
            res.render('admin/categories/index',{title : 'دسته ها',categories});
        } catch (error) {
            
            next(error);
        }
    }

    async create(req,res){
        let categories = await Category.find({parent : null}); // return parent node
        res.render('admin/categories/create',{categories});
    }

    async store(req,res,next){
        try {
            let status = await this.validationData(req);
            //console.log(req.file);
        
            if(!status){return this.back(req,res);}
         
            // create course
           let { name , parent } = req.body;
           let newCategory = new Category({
               name , 
               parent : parent !== 'none' ? parent : null 
           })// getting data from my fron withote change
            // console.log(newCourse);
           await newCategory.save();
           
    
           return res.redirect('/admin/categories');
        } catch (error) {
            
            next(error);
        }
    }
    
    async edit(req,res,next){
        
        try {
            this.isMongoId(req.params.id);
            let category = await Category.findById(req.params.id);
            let categories = await Category.find({ parent : null });
            if(!category) this.error('  چنین دسته ای وحود ندارد  ',404);
  
            return res.render('admin/categories/edit',{categories ,  category });
         } catch (error) {
            next(error); 
         }
    }

    async update(req,res,next){
        
       try {
        let status = await this.validationData(req);
        if(!status) return this.back(req,res);
      
        let {name , parent } = req.body ;
         
        await Category.findByIdAndUpdate(req.params.id , {$set : {
            name , 
            parent : parent !== 'none' ? parent : null
        }})// ...req.body  ... baes mishe azaye ye object kamel bere toye objecte dige
        console.log(parent)
        
        return res.redirect('/admin/categories');
       } catch (error) {
        console.log('errrroooor')
           next(error);
       }

       
    }

    async destroy(req,res,next){
         try {
            this.isMongoId(req.params.id);
            
            let  category = await Category.findById(req.params.id).populate('childs').exec();
            if(!category) this.error('  چنین دسته ای وجود ندارد  ',404);
            
            //return  res.json(category);
            category.childs.forEach(category => {
                category.remove();
            });
            //delete category
            
            category.remove() ;
            return res.redirect('/admin/categories'); 
        } catch (error) { 
            
             next(error);
         }
    }

    async updateCourseTime(courseId){
        let course = await Course.findById(courseId).populate('episodes').exec();
        
        //console.log(episodes);
        console.log(this.getTime(episodes));
        course.set({time : this.getTime(course.episodes)});
        await course.save();
    }

}

module.exports = new categoryController();