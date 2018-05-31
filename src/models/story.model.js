//khai báo
const mongoose = require('mongoose');
//tạo obj Schema
const {Schema} = mongoose;
//use Schema
storySchema = new Schema({
    content:{type:String, trim:true, required:true}
});
const Story = mongoose.model('Story',storySchema);
//exports
module.exports = {Story};