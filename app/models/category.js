const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');


const categorySchema = Schema({
       name : { type : String , required : true },
       parent : {type : Schema.Types.ObjectId , ref : 'Category' , default : null }
} , { timestamps : true  , toJSON : { virtuals : true } });

// for find child , we must create virtual

categorySchema.virtual('childs', { 
       ref : 'Category',
       localField : '_id',
       foreignField : 'parent'
})

categorySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Category' , categorySchema);