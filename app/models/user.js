const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const UniqueString = require('unique-string');

const userSchema = mongoose.Schema({
      name : {type : String , require : true},
      admin : {type : Boolean , require :true , default : 0} ,//baraye inke chek konim admin hast karbar ya kheir// be sorate defult admin nist 
      // ke chon defult admin nist karbar miyaym defult ro 0 mizarim

      email : { type:String ,unique : true ,require : true},// email har kabar faghat yeki mistone bashe
      password : { type: String ,require : true },
      // rememberToken : {}// baraye cooki 

      // baraye faal kardane yadavariye vorod
      rememberToken :{type : String , default:null}

},{timestamps : true});

// baraye hash kardane passwor 
// ye method ghablesave shodane user seda mzianim 3

userSchema.pre('save',function(next){
     // use pachage bcrypt  
     bcrypt.hash(this.password , bcrypt.genSaltSync(15), (err, hash)=> {
         // chon mikhaim be this dastresi peyda konim az callback func estefade mikonim na func
         // Store hash in your password DB.
         if (err) console.log(err);
         this.password = hash;
         next();
      });
})

// baraye chek kardane password dakhele login ke aya user password ro drost mzane ya na 

userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password , this.password);// password ra ke behesh dadim  ba data base chek mikone
    
}

userSchema.methods.setRememberToken = function(res){
    const token = UniqueString();
    res.cookie('remember_token',token,{maxAge :1000*60*60*24*30*9, httpOnly : true,signed:true});// use package cookie parser// baraye ramznegariye cooki az signed estefade mikonim
//  update mongodb
    this.update({rememberToken:token},err =>{
       if(err) console.log(err);
    });
    
}

module.exports = mongoose.model('User' , userSchema);