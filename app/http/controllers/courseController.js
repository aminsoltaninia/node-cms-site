const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const Category= require('app/models/category');
const Payment = require ('app/models/payment');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
var rp = require('request-promise');

class courseController extends controller {
    
    async index(req , res) {
        let query = {};
        let { search , type , category } = req.query;
  
        if(search) 
            query.title = new RegExp(search , 'gi');

        if(type && type != 'all')
            query.type = type;

        if(category && category != 'all') {
            category = await Category.findOne({ slug : category});
            if(category) 
                query.categories = { $in : [ category.id ]}
        }

        let courses = Course.find({ ...query });


        if(req.query.order) 
            courses.sort({ createdAt : -1})

        courses = await courses.exec();

        let categories = await Category.find({});
        res.render('home/courses' , { courses , categories});
    }

    async payment(req , res , next ){
        try {
            this.isMongoId(req.body.course)
           
            let course= await Course.findById(req.body.course)
            if(!course){
                // console.log('not found');
                 return this.alerAndBack( req , res ,{
                    title : ' دقت کنید ',
                    message : ' there isnt course ' ,
                    typeIcon : ' error ',
                     button : ' خیلی خوب '
                  }) ; 
                
            }
            if(await req.user.checkBuying(course)){
               // console.log('you are a number of course , already ')
                
                return this.alerAndBack( req , res ,{
                  title : ' دقت کنید ',
                  message : ' you are join this course already ' ,
                  typeIcon : ' error ',
                  button : ' خیلی خوب '
               }) ;
               
                
            }

            if(course.price == 0 && (course.type == 'vip' || course.type == 'free')){
               // console.log(' ')
                return this.alerAndBack( req , res, {
                  title : ' دقت کنید ',
                  message : ' this course is for vip and free members ' ,
                  typeIcon : ' error ',
                   button : ' خیلی خوب '
                }) ;  
            }

            // buy proccess 
            
            let params = { 
                MerchantID : 'f83cc956-f59f-11e6-889a-005056a205be',
                Amount : course.price,
                CallbackURL : 'http://localhost:3000/courses/payment/checker',
                Description : `بابت خرید دوره ${course.title}`,
                Email : req.user.email

            };
            
            let options = this.getUrlOption('https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json',params)
            rp(options)
                 .then(async data => { 
                    // res.json(data);
                     let payment = new Payment ({
                         user : req.user.id , 
                         course : course.id , 
                         resNumberUniq : data.Authority , 
                         price : course.price 
                     });               
                     
                     await payment.save();

                     res.redirect(`https://www.zarinpal.com/pg/StartPay/${data.Authority}`)
                 })
                 .catch(err => res.json(err.message));

        } catch (error) {
            next(error)
        }
    }
    
    async checker(req,res,next) { 
        try {
            // res.json(req.query);// for return from dargahe pardakht post Use to req.body
            if(req.query.Status && req.query.Status !== 'OK')  {
            //   return this.alerAndBack( req , res ,{
            //       title : ' دقت کنید ',
            //       message : ' your payment is faild ' ,
                
            //    }) ;


            } 
         
            let payment = await Payment.findOne({ resNumberUniq : req.query.Authority}).populate('course').exec();
            // return res.json(payment)

            if(! payment.course)
               return this.alerAndBack( req , res ,{
                  title : ' دقت کنید ',
                  message : ' there isnt course ' ,
                  typeIcon : 'error'
               }) ;

            //    payment.set({ payment : true })   
            //    req.user.learning.push(payment.course.id)
               
            //    await payment.save();
            //    await req.user.save();

            //    this.alert( req , { 
            //        title : ' با تشکر ',
            //        message : ' پرداخت با موفقیت انجام شد ',
            //        info : 'success',
            //        button : ' ookk '
            //   })
            //   res.redirect(payment.course.path());   
            let params = {
                MerchantID : 'f83cc956-f59f-11e6-889a-005056a205be',
                Amount : payment.course.price,
                Authority : req.query.Authority
            }

             
            let options = this.getUrlOption( 'https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json' , params )
           
            rp(options)
               .then(async data => {
                   if(data.Status == 100 ){
                      payment.set({ payment : true })   
                      req.user.learning.push(payment.course.id)
                      
                      await payment.save();
                      await req.user.save();

                      this.alert( req , { 
                          title : ' با تشکر ',
                          message : ' پرداخت با موفقیت انجام شد ',
                          typeIcon : 'success',
                          button : ' ookk '
                     })
                     res.redirect(payment.course.path());
                   } else {
                     this.alerAndBack( req , res ,{
                        title : ' دقت کنید ',
                        message : ' your payment faild in then into cheker ' ,
                      
                     }) ;
      
                   }
               })
               .catch(err => {
                    return this.alerAndBack( req , res ,{
                          title : ' دقت کنید ',
                          message : ' your payment faild in cheker ' ,
                        
                       }) ;
        
               })
        
        } catch (error) {
            next(error)
        }
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
        
        let categories = await Category.find({ parent : null }).populate('childs').exec();                       
        

        res.render('home/single-course' , { course  , categories});
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

  

    checkHash(req , episode) {
        let timestamps = new Date().getTime();
        if(req.query.t < timestamps) return false;

        let text = `aQTR@!#Fa#%!@%SDQGGASDF${episode.id}${req.query.t}`;
        
        return bcrypt.compareSync(text , req.query.mac);
    }


    getUrlOption( url , params ){
        return {
            method : 'POST',
            uri : url ,
            headers : {
                'cache-control' : 'no-cache',
                'content-type' : 'application/json'
            },
            body : params ,
            json : true   
        }
    }
}

module.exports = new courseController();