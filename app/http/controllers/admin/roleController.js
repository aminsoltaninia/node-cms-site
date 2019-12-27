const controller = require('app/http/controllers/controller');

const Role = require('app/models/role');
const Permission = require('app/models/permission');

class roleController extends controller {
    
    async index(req , res) {
         
        try {
            //let courses = await Course.find({}).sort({createdAt:1});// a akhar be aval . -1 az aval be akhar 
            let page = req.query.page || 1;// age pagi  nabood 1 ro bargardoe
            //console.log(page);
            let roles = await Role.paginate({},{page,sort:{createdAt:1},limit : 20  });
            //return res.json(categories);
            res.render('admin/role/index',{title : 'سطوح دسترسی ',roles});
        } catch (error) {
            
            next(error);
        }
    }

    async create(req,res){

        let permissions = await Permission.find({});
        //console.log(permissions)
        res.render('admin/role/create' , {permissions});
    }

    async store(req,res,next){
        try {
            let status = await this.validationData(req);
            //console.log(req.file);
        
            if(!status){return this.back(req,res);}
         
            // create course
           let { name , label , permissions } = req.body;
           let newrole = new Role({
               name , 
               label,
               permissions
           })// getting data from my fron withote change
            // console.log(newCourse);
           await newrole.save();
           
    
           return res.redirect('/admin/users/roles');
        } catch (error) {
            
            next(error);
        }
    }
    
    async edit(req,res,next){
        
        try {
            this.isMongoId(req.params.id);

            let role = await Role.findById(req.params.id);
            let permissions = await Permission.find({});
            if(!role) this.error('  چنین  سطح دسترسی وجود ندارد  ',404);
  
            return res.render('admin/role/edit',{ role, permissions });
         } catch (error) {
            next(error); 
         }
    }

    async update(req,res,next){
        
       try {
        let status = await this.validationData(req);
        if(!status) return this.back(req,res);
      
        let {name , label , permissions } = req.body ;
         
        await Role.findByIdAndUpdate( req.params.id , {$set : {
            name , 
            label , 
            permissions
        }})
        
        return res.redirect('/admin/users/roles');
       } catch (error) {
       // console.log('errrroooor')
           next(error);
       }

       
    }

    async destroy(req,res,next){
         try {
            this.isMongoId(req.params.id);
            
            let  role = await Role.findById(req.params.id);
            if(!role) this.error('  چنین سطح دسترسی وجود ندارد  ',404);
            
            
            role.remove() ;
            return res.redirect('/admin/users/roles'); 
        } catch (error) { 
            
             next(error);
         }
    }

}

module.exports = new roleController();