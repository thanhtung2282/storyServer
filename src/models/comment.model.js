//khai báo
const mongoose = require('mongoose');
//tạo obj Schema
const {Schema} = mongoose;
//use Schema
commentSchema = new Schema({
    content:{type:String, trim:true, required:true},
    story:{type:mongoose.SchemaTypes.ObjectId, ref:'Story'},
    author:{type:mongoose.SchemaTypes.ObjectId, ref:'User'},
    fans:[{type:mongoose.SchemaTypes.ObjectId, ref:'User'}]

});
const Comment = mongoose.model('Comment',commentSchema);
//exports
module.exports = {Comment};