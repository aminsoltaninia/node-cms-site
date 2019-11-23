const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const fs = require('fs');
const sharp = require('sharp');
const path=require('path');
class episodeController extends controller {
    
    async index(req , res) {
         
        try {
            //let courses = await Course.find({}).sort({createdAt:1});// a akhar be aval . -1 az aval be akhar 
            let page = req.query.page || 1;// age pagi  nabood 1 ro bargardoe
            //console.log(page);
            let episodes = await Episode.paginate({},{page,sort:{createdAt:1},limit : 2 , populate : 'course'});
            //return res.json(episodes);
            res.render('admin/episodes/index',{title : 'ویدیو ها',episodes});
        } catch (error) {
            
            next(error);
        }
    }

    async create(req,res){
        let courses = await Course.find({})
        res.render('admin/episodes/create',{courses});
    }

    async store(req,res,next){
        try {
            let status = await this.validationData(req);
            //console.log(req.file);
        
            if(!status){return this.back(req,res);}
         
            // create course
        
           let newEpisode = new Episode({...req.body})// getting data from my fron withote change
            // console.log(newCourse);
           await newEpisode.save();
           
           // Updates course times 
           this.updateCourseTime(req.body.course)
           return res.redirect('/admin/episodes');
        } catch (error) {
            
            next(error);
        }
    }
    
    async edit(req,res,next){
        
        try {
            this.isMongoId(req.params.id);
            let episode = await Episode.findById(req.params.id);
            let courses = await Course.find({});
            if(!episode) this.error('  چنین ویدیویی وحود ندارد  ',404);
                
            
  
  
            return res.render('admin/episodes/edit',{episode,courses});
         } catch (error) {
            next(error); 
         }
    }

    async update(req,res,next){
        
       try {
        let status = await this.validationData(req);
        if(!status) return this.back(req,res);
      
      
       
        let episode = await Episode.findByIdAndUpdate(req.params.id , {$set : {...req.body}})// ...req.body  ... baes mishe azaye ye object kamel bere toye objecte dige
        
        //prev course time update
        this.updateCourseTime(episode.course);
        //noe course time update 
        this.updateCourseTime(req.body.course);

        return res.redirect('/admin/episodes');
       } catch (error) {
           
           next(error);
       }

       
    }

    async destroy(req,res,next){
         try {
            this.isMongoId(req.params.id);
            
            let episode = await Episode.findById(req.params.id);
            if(!episode) this.error('  چنین ویدیویی وحود ندارد  ',404);
            

            let courseId = episode.course; 
            //delete course
            
            episode.remove() ;

            // course time update   
            this.updateCourseTime(courseId);
            // at the end 
        
            return res.redirect('/admin/episodes'); 
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

module.exports = new episodeController();