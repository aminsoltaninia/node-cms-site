const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Payment = require('app/models/payment'); 
class userController extends controller {
    
    async index(req , res , next ) {
       try {
           res.render('home/panel/index' , { title : ' پنل '})
       } catch (error) {
           next(error)
       }
    }

    async history(req , res , next ) {
        try {
            let page = req.query.page || 1;
            let payments = await Payment.paginate({ user : req.user.id } , { page , sort : { createdAt : 1 } , limit : 20 , populate : 'course' });
          
            res.render('home/panel/history' , { title : ' تاریخچه پرداخت ها ' , payments}) 
        } catch (error) {
            next(error)
        }
    }

   
}

module.exports = new userController();