const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

class courseController extends controller {
    
    async index(req , res) {
        //return res.json(req.query)//for search box
        let query = {};
        
        if (req.query.search)
           query.title = new RegExp(req.query.search , 'gi')// global search and case insensetive search
        console.log(query) 
        let courses =await Course.find({...query})
       // return res.json(courses);

        res.render('home/courses' , { courses });
    }
     
    async single(req , res) {
        let course = await Course.findOneAndUpdate({ slug : req.params.course } , { $inc : { viewCount: 1 } })// for increment use inc from mongodb query
                                .populate([
                                    {
                                        path : 'user',
                                        select : 'name'
                                    } ,
                                    {
                                        path : 'episodes',
                                        options : { sort : { number : 1} }
                                    }
                                ])
                                .populate([
                                    {
                                        path : 'comments',
                                        match : {
                                            parent : null,
                                            approved : true
                                        },
                                        populate : [
                                            {
                                                path : 'user',
                                                select : 'name'
                                            },
                                            {
                                                path : 'comments',
                                                match : {
                                                    approved : true
                                                },
                                                populate : { path : 'user' , select : 'name'}
                                            }   
                                        ]
                                    }
                                ]);
        let canUserUse = await this.canUse(req , course);

        res.render('home/single-course' , { course , canUserUse});
    }

    async download(req , res , next) {
       try {
            this.isMongoId(req.params.episode);

            let episode = await Episode.findById(req.params.episode);
            if(! episode) this.error('چنین فایلی برای این جلسه وجود ندارد',404);

            if(! this.checkHash(req , episode)) this.error('اعتبار لینک شما به پایان رسیده است', 403);

            let filePath = path.resolve(`./public/download/jHYYGYdef9787LJ523526GHbb/${episode.videoUrl}`);
            if(! fs.existsSync(filePath)) this.error('چنین فایل برای دانلود وجود ندارد',404);
            
           // episode.downloadCount += 1 ;
            await episode.inc('downloadCount');
            
           
           
           return res.download(filePath)
           
       } catch (err) {
           next(err);
       }
    }

    async canUse(req  , course) {
        let canUse = false;
        if(req.isAuthenticated()) {
            switch (course.type) {
                case 'vip':
                    canUse = req.user.isVip()
                    break;
                case 'cash':
                    canUse = req.user.checkBuying(course);
                    break;
                default:
                    canUse = true;
                    break;
            }
        }
        return canUse;
    }

    checkHash(req , episode) {
        let timestamps = new Date().getTime();
        if(req.query.t < timestamps) return false;

        let text = `aQTR@!#Fa#%!@%SDQGGASDF${episode.id}${req.query.t}`;
        
        return bcrypt.compareSync(text , req.query.mac);
    }
}

module.exports = new courseController();