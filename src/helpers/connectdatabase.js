// khai báo 
const mongoose = require('mongoose');
//tạo function lấy biến môi trường
function getDatabaseUri(){
    // môi trường server heroku
    if(process.env.NODE_ENV === 'production') return '';
    //môi trường test
    if(process.env.NODE_ENV === 'test') return 'mongodb://localhost/mean1003-test';
    // môi trường local
    return 'mongodb://localhost/mean1003';
}
//connect
mongoose.connect(getDatabaseUri())
.then(()=>console.log('Connected Database'))
.catch((error)=>{
    console.log('Error Connect Database : ',error.message);
    process.exit(1);
})