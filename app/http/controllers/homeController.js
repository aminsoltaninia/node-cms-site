const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Comment = require('app/models/comment');
const sm = require('sitemap');

class homeController extends controller {
    
    async index(req , res) {
        let courses = await Course.find({ lang : req.getLocale()}).sort({ createdAt : 1}).limit(8).exec();
        res.render('home/index' , { courses });
    }

    async aboutme(req , res) {
        res.render('home/about');
    }

    async comment(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);
        
            let newComment = new Comment({
                user : req.user.id,
                ...req.body
            });

            await newComment.save();

            return this.back(req, res);
        } catch (err) {
            next(err);
        }
    }

    async sitemap(req , res , next) {
        try {
            let sitemap = sm.createSitemap({
                hostname : config.siteurl,
                // cacheTime : 600000
            });

            sitemap.add({ url : '/' , changefreq : 'daily' ,priority : 1 });
            sitemap.add({ url : '/courses' , priority : 1});


            // let courses = await Course.find({ }).sort({ createdAt : -1 }).exec();
            // courses.forEach(course => {
            //     sitemap.add({ url : course.path() , changefreq : 'weekly' , priority : 0.8 })
            // })

            // let episodes = await Episode.find({ }).populate('course').sort({ createdAt : -1 }).exec();
            // episodes.forEach(episode => {
            //     sitemap.add({ url : episode.path() , changefreq : 'weekly' , priority : 0.8 })
            // })

            res.header('Content-type' , 'application/xml');
            res.send(sitemap.toString());

        } catch (err) {
            next(err);
        }
    }
}

module.exports = new homeController();