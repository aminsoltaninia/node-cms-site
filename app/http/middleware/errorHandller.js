

 class errorHandller {
  async error404(req,res,next){
    
        try {
            res.statusCode = 404 ;
            throw new Error('چنین صفحه ای یافت نشد')
        } catch (error) {
            next(error)
        }
        
   
 }

 async handller(error,req,res,next){
    const statusCode = error.statusCode || 500;
    const message = error.message || "";
    const stack = error.stack || "";

    const layout = {
        layout : 'errors/master',
        extractScripts : false,
        extractStyles : false
    }
    
    if(config.debug)
       return res.render('errors/stack' , { ...layout ,message , stack});
    return  res.render(`errors/${statusCode}`, { ...layout ,message , stack}); 
   }

}

module.exports = new errorHandller();