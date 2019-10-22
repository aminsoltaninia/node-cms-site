module.exports = class Helpers{

    // az app.local bahre mabarim baaye inke ye seri informATION RO GLOBAL KONIM
   constructor(req,res){
       this.req = req;
       this.res = res;
   }   

   getObjects(){

       return {
           auth : this.auth()
       }    


   }
   auth(){
       return {
        user : this.req.user,
        check : this.req.isAuthenticated()
       }
   }

    // app.locals ={
    //     auth:{
    //        user : req.user,
    //        check : req.isAuthenticated()// baraye chek kardane inek user login karde ya kheir
    //     } 
    //  };


 

}