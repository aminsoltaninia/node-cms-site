const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const commentSchema = Schema({
    user : { type : Schema.Types.ObjectId , ref : 'User'},
    parent : { type : Schema.Types.ObjectId , ref : 'Comment' , default : null },
    approved : { type : Boolean , default : false },
    course : { type : Schema.Types.ObjectId , ref : 'Course' , default : undefined },
    episode : { type : Schema.Types.ObjectId , ref : 'Episode' , default : undefined },
    comment : { type : String , required  : true}
} , { timestamps : true , toJSON : { virtuals : true } });

commentSchema.plugin(mongoosePaginate);

commentSchema.virtual('comments' , {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'parent'
})

const commentbelong = doc =>{
    if(doc.course)
            return 'Course'
        else if(doc.episode)
            return 'Episode'
}

commentSchema.virtual('belongTo' , {
    ref : commentbelong,
    localField :  doc => commentbelong(doc).toLowerCase(),// sensinitive for capital 
    foreignField : '_id',  
    justOne: true
})

module.exports = mongoose.model('Comment' , commentSchema);