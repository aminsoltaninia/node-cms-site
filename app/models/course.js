const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const courseSchema = schema({
     user :{ type : schema.Types.ObjectId , ref : 'User' },// id kasi ke course ro be vojod miyare zakhore mikonim
     title : { type : String , required : true },
     slug : { type : String , required : true },// baes mishe title doore tabdil be url ke user bebine 
     type : { type : String , required : true },
     body : { type : String , required : true },
     price : { type : String , required : true },
     images : { type : Object , required : true },
     thumb  : { type : String , required : true },
     tags : { type : String , required : true },
     time : { type : String , default : '00:00:00' },
     viewCount : { type : Number , default : 0 },// tedade bazdid haye in safe
     commentCount : { type : Number , default : 0 },// tedade nazarhaye marboot be in doore
    } , { timestamps : true , toJSON : {virtuals : true }});


courseSchema.plugin(mongoosePaginate);// ba plugin ghabeliyate mongoosepaginate ro ezafe mikonim


courseSchema.methods.typeToPersian = function(){
    switch (this.type) {
        case 'cash':
                return 'نقدی'
            break;
        case 'vip':
                return 'عضویت ویژه'
            break; 
        default:
                return ' رایگان'
            break;
    }
}

courseSchema.methods.path = function(){
     return `/courses/${this.slug}`;
}

courseSchema.virtual('episodes',{
    ref : 'Episode', // use model   
    localField : '_id',
    foreignField : 'course'
})  


module.exports = mongoose.model('Course' ,courseSchema);