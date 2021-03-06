//khai báo
const mongoose = require('mongoose');
//tạo obj Schema
const {Schema} = mongoose;
//use Schema
storySchema = new Schema({
    content:{type:String, trim:true, required:true},
    author:{type:mongoose.SchemaTypes.ObjectId, ref:'User'},
    fans:[{type:mongoose.SchemaTypes.ObjectId, ref:'User'}],
    comments:[{type:mongoose.SchemaTypes.ObjectId, ref:'Comment'}],
});
const Story = mongoose.model('Story',storySchema);
//exports
module.exports = {Story};