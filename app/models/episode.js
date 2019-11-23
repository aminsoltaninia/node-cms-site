const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const episodeSchema = schema({
     course :{ type : schema.Types.ObjectId , ref : 'Course' },// id kasi ke course ro be vojod miyare zakhore mikonim
     title : { type : String , required : true },
     type : { type : String , required : true },
     body : { type : String , required : true },
     videoUrl : { type : String , required : true },
     number : { type : Number , required : true },
     time : { type : String , default : '00:00:00' },
     downloadCount : { type : Number , default : 0 },
     viewCount : { type : Number , default : 0 },// tedade bazdid haye in safe
     commentCount : { type : Number , default : 0 },// tedade nazarhaye marboot be in doore
    } , { timestamps : true , toJSON : {virtuals : true } });


    episodeSchema.plugin(mongoosePaginate);// ba plugin ghabeliyate mongoosepaginate ro ezafe mikonim


    episodeSchema.methods.typeToPersian = function(){
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

module.exports = mongoose.model('Episode' ,episodeSchema);