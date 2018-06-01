//khai báo
const mongoose = require('mongoose');
//tạo obj Schema
const {Schema} = mongoose;
//use Schema
userSchema = new Schema({
    email:{type:String, trim:true, required:true ,unique:true},
    password:{type:String, trim:true, required:true },
    name:{type:String, trim:true, required:true},
    stories:[{ type:mongoose.SchemaTypes.ObjectId, ref:'Story' }]
});
const User = mongoose.model('User',userSchema);
//exports
module.exports = {User};