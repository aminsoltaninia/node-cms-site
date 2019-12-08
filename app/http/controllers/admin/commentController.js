const controller = require('app/http/controllers/controller');
const Comment = require('app/models/comment')
class commentController extends controller {
    
    async index(req , res , next) {
         
        try {
            //let courses = await Course.find({}).sort({createdAt:1});// a akhar be aval . -1 az aval be akhar 
            let page = req.query.page || 1;// age pagi  nabood 1 ro bargardoe
            //console.log(page);
            let comments = await Comment.paginate({approved : true },{page,sort:{createdAt: -1},limit : 5 ,
                 populate : [ 
                     {
                     path : 'user' ,
                     select : 'name'
                     },
                     'course', 
                     {
                         path : 'episode',
                         populate : [
                             {
                                 path : 'course' , 
                                 select : 'slug'
                             }
                         ]
                    
                     }
                 ]
            });
           // return res.json(comments);
            res.render('admin/comments/index',{ title : ' کامنت ها ', comments});
        } catch (error) {
            
            next(error);
        }
    }


    async update(req,res,next){
        try {
            this.isMongoId(req.params.id);
            let comment = await Comment.findById(req.params.id).populate('belongTo').exec();
            if(!comment) this.error('  چنین کامنتی وحود ندارد  ',404);
            
           // return res.json(comment)
            await comment.belongTo.inc('commentCount');
            
           // return res.json(comment);    
            comment.approved = true;
            await comment.save();

            return this.back(req,res);

        } catch (error) {
            next(error)
        }
    }

    async destroy(req,res , next){
        try {
            this.isMongoId(req.params.id);
            
            let comment = await Comment.findById(req.params.id).exec();
            if(!comment) this.error('  چنین کامنتی وحود ندارد  ',404);
                
            
            comment.remove() ;

            // at the end 
        
            return this.back(req,res) 
        } catch (error) {
            
             next(error);
         }
    }


    async approved (req,res,next){
         
        try {
            //let courses = await Course.find({}).sort({createdAt:1});// a akhar be aval . -1 az aval be akhar 
            let page = req.query.page || 1;// age pagi  nabood 1 ro bargardoe
            //console.log(page);
            let comments = await Comment.paginate({approved : false},{page,sort:{createdAt: -1},limit : 5 ,
                 populate : [ 
                     {
                     path : 'user' ,
                     select : 'name'
                     },
                     'course', 
                     {
                         path : 'episode',
                         populate : [
                             {
                                 path : 'course' , 
                                 select : 'slug'
                             }
                         ]
                    
                     }
                 ]
            });
           // return res.json(comments);
            res.render('admin/comments/approved',{ title : ' کامنت های تایید نشده ', comments});
        } catch (error) {
            
            next(error);
        }
    }

}

module.exports = new commentController();