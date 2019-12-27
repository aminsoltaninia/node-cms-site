const controller = require('app/http/controllers/controller');

const Permission = require('app/models/permission');

class permissionController extends controller {
    
    async index(req , res) {
         
        try {
            //let courses = await Course.find({}).sort({createdAt:1});// a akhar be aval . -1 az aval be akhar 
            let page = req.query.page || 1;// age pagi  nabood 1 ro bargardoe
            //console.log(page);
            let permissions = await Permission.paginate({},{page,sort:{createdAt:1},limit : 20  });
            //return res.json(categories);
            res.render('admin/permission/index',{title : 'لیست اجازه دسترسی ',permissions});
        } catch (error) {
            
            next(error);
        }
    }

    async create(req,res){
       
        res.render('admin/permission/create');
    }

    async store(req,res,next){
        try {
            let status = await this.validationData(req);
            //console.log(req.file);
        
            if(!status){return this.back(req,res);}
         
            // create course
           let { name , label } = req.body;
           let newpermission = new Permission({
               name , 
               label
           })// getting data from my fron withote change
            // console.log(newCourse);
           await newpermission.save();
           
    
           return res.redirect('/admin/users/permissions');
        } catch (error) {
            
            next(error);
        }
    }
    
    async edit(req,res,next){
        
        try {
            this.isMongoId(req.params.id);

            let permission = await Permission.findById(req.params.id);
           
            if(!permission) this.error('  چنین اجازه دسترسی وجود ندارد  ',404);
  
            return res.render('admin/permission/edit',{ permission });
         } catch (error) {
            next(error); 
         }
    }

    async update(req,res,next){
        
       try {
        let status = await this.validationData(req);
        if(!status) return this.back(req,res);
      
        let {name , label } = req.body ;
         
        await Permission.findByIdAndUpdate(req.params.id , {$set : {
            name , 
            label
        }})
        
        return res.redirect('/admin/users/permissions');
       } catch (error) {
       // console.log('errrroooor')
           next(error);
       }

       
    }

    async destroy(req,res,next){
         try {
            this.isMongoId(req.params.id);
            
            let  permission = await Permission.findById(req.params.id).exec();
            if(!permission) this.error('  چنین اجازه دسترسی وجود ندارد  ',404);
            
            
            permission.remove() ;
            return res.redirect('/admin/users/permissions'); 
        } catch (error) { 
            
             next(error);
         }
    }

}

module.exports = new permissionController();