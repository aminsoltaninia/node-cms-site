const mongoose=require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({
      name : {type : String , require : true},
      admin : {type : Boolean , require :true , default : 0} ,//baraye inke chek konim admin hast karbar ya kheir// be sorate defult admin nist 
      // ke chon defult admin nist karbar miyaym defult ro 0 mizarim

      email : { type:String ,unique : true ,require : true},// email har kabar faghat yeki mistone bashe
      password : { type: String ,require : true },
      // rememberToken : {}// baraye cooki 
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

module.exports = mongoose.model('User' , userSchema);