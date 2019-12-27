const controller = require('app/http/controllers/controller');

const User = require('app/models/user');
const Role = require('app/models/role');

class userController extends controller {
    
    async index(req , res) {
         
        try {
            //let courses = await Course.find({}).sort({createdAt:1});// a akhar be aval . -1 az aval be akhar 
            let page = req.query.page || 1;// age pagi  nabood 1 ro bargardoe
            //console.log(page);
            let users = await User.paginate({},{page,sort:{createdAt:1},limit : 20 });
            //return res.json(categories);
            res.render('admin/users/index',{title : 'کاربران',users});
        } catch (error) {
            
            next(error);
        }
    }
    async create(req,res,next){
        try {
            res.render('admin/users/create')
        } catch (error) {
            next(error)
        }
    }
    async addRole(req,res,next){
        try {
            this.isMongoId(req.params.id);

            let user = await User.findById(req.params.id);
            let roles = await Role.find({});
            if( ! user ) this.error('چنین کاریری وجود ندارد' , 404);


            res.render('admin/users/addrole' , { user , roles })
        } catch (error) {
            next(error)
        }
    }
    async store(req,res,next){
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res); 
            let { name , email , password } = req.body ; 

            let newUser = new User({
                name ,
                email , 
                password

            });
            console.log(newUser)
            await newUser.save();
            return res.redirect('/admin/users');
        } catch (error) {
            next(error)
        }
    }
    async destroy (req,res,next){
        try {
            this.isMongoId(req.params.id);

            let user = await User.findById(req.params.id).populate({ path : 'courses' , populate : [ 'episodes']}).exec();
            if(! user) this.error('چنین کاربری وجود ندارد',404);
            //return res.json(user);
            user.courses.forEach(course => {
                course.episodes.forEach(episode => episode.remove());
                course.remove();
            });

            user.remove();
            return res.redirect('/admin/users');
        } catch (error) {
            next(error)
        }
    }

   
    async toggleadmin(req , res , next) {
        try {
            this.isMongoId(req.params.id);

            let user = await User.findById(req.params.id);
            user.set({ admin : ! user.admin});
            await user.save();

            return this.back(req , res);
        } catch (err) {
            next(err)
        }
    }

    
    async edit(req, res ,next) {
        try {
            this.isMongoId(req.params.id);

            let category = await Category.findById(req.params.id);
            let categories = await Category.find({ parent : null });
            if( ! category ) this.error('چنین دسته ای وجود ندارد' , 404);


            return res.render('admin/categories/edit' , { category , categories });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res , next) {
        try {
            let status = await this.validationData(req);
            if(! status) return this.back(req,res);

            let { name , parent } = req.body;
            
            await Category.findByIdAndUpdate(req.params.id , { $set : { 
                name,
                slug : this.slug(name),
                parent : parent !== 'none' ? parent : null
             }})

            return res.redirect('/admin/categories');
        } catch(err) {
            next(err);
        }
    }

    async storeRoleForUser( req , res , next ){
        try {
            this.isMongoId(req.params.id);
            //return res.json(req.body);
            let user = await User.findById(req.params.id);
          
            if( ! user ) this.error('چنین کاریری وجود ندارد' , 404);

            user.set({ roles : req.body.roles });
            await user.save();
            res.redirect('/admin/users'); 

        } catch (error) {
            next(error)
        }
    }
}

module.exports = new userController();