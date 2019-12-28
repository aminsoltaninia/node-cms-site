const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueString = require('unique-string')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const userSchema =Schema({
    name : { type : String , required : true },
    admin : { type : Boolean ,  default : 0 },
    email : { type : String , unique : true  ,required : true},
    password : { type : String ,  required : true },
    vipTime : { type : Date , default : new Date().toISOString() },
    vipType : { type : String , default : 'month' },
    rememberToken : { type : String , default : null },
    learning : [{  type : Schema.Types.ObjectId , ref : 'Course'}],
    roles : [{  type : Schema.Types.ObjectId , ref : 'Role'}]
} , { timestamps : true , toJSON : {virtuals : true } });


userSchema.pre('save' , function(next) {
    let salt = bcrypt.genSaltSync(15) ;
    let hash = bcrypt.hashSync(this.password,salt);


    this.password= hash;
    next();
});

userSchema.plugin(mongoosePaginate);

userSchema.pre('findOneAndUpdate' , function(next) {

    let salt = bcrypt.genSaltSync(15) ;
    
    let hash = bcrypt.hashSync( this.getUpdate().$set.password,salt);
    //console.log(`hash : ${hash}`);

    this.getUpdate().$set.password= hash;
    next();

});


userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password , this.password);
}

userSchema.methods.hasRole = function(roles) {
    let result = roles.filter(role => {
        return this.roles.indexOf(role) > -1 ;
    })
    console.log(result)
    return !! result.length ; // if 0 ret false , if 1 ret true
}


userSchema.methods.setRememberToken = function(res) {
    const token = uniqueString();
    res.cookie('remember_token' , token , { maxAge : 1000 * 60 * 60 * 24 * 90 , httpOnly : true , signed :true});
    this.update({ rememberToken : token } , err => {
        if(err) console.log(err);
    });
}

userSchema.virtual('courses',{
     ref : 'Course', // use model   
     localField : '_id',
     foreignField : 'user'
})

userSchema.methods.isVip = function(){
    return new Date(this.vipTime) > new Date() ; 
}

userSchema.methods.checkBuying = function(courseId){
    return this.learning.indexOf(courseId) !== -1;// age vojod ndashte bashe -1 mide
}

module.exports = mongoose.model('User' , userSchema);