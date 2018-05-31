const express =require('express');
const {json} = require('body-parser');
const {hash,compare} = require('bcryptjs');
const {Story} = require('./models/story.model');
const {User} = require('./models/user.model');
const app = express();
//middleware json
app.use(json());
// lấy tất cả story
app.get('/story',(req,res)=>{
    Story.find({}).then((stories)=>res.send({success:true, stories}));
})
// tạo mới story
app.post('/story',(req,res)=>{
    // lấy các giá trị được gữi lên
    const { content } = req.body;
    //tạo
    const story = new Story({content});
    //lưu
    story.save()
    .then((storyInfo)=>{res.send({success:true , story:storyInfo})})
    .catch((error)=>res.status(400).send({success:false, message:error.message}));  
});
// sửa story
app.put('/story/:_id',(req,res)=>{
    // lấy các giá trị dc gửi lên
    const {content} = req.body;
    //sửa 
    Story.findByIdAndUpdate(req.params._id,{content}, {new:true})
    .then((story)=>{
        if(!story) throw new Error('Cannot Find Story');
        res.send({success:true, story});
    })
    .catch((error)=>{
        res.status(400).send({success:false, message:error.message});
    })
});
//delete story
app.delete('/story/:_id',(req,res)=>{
    Story.findByIdAndRemove(req.params._id)
    .then( story => {
        if(!story) throw new Error('Cannot Find Story');
        res.send({success:true, story});
    })
    .catch((error)=>{
        res.status(400).send({success:false, message:error.message});
    })
});
//user 
//signUP
app.post('/user/signin', (req, res) => {
    //get du lieu
        const { email, plainPassword } = req.body;
        let user;
        //tim theo email
        User.findOne({ email })
        //kiem tra tồn tại user and sosanh pass
        .then(u => {
            if (!u) throw new Error('Cannot find user');
            user = u;
            return compare(plainPassword, u.password);
        })
        //send result
        .then(same => {
            if (!same) throw new Error('Invalid password');
            return res.send({ success: true, user });
        })
        .catch(error => res.status(400).send({ success: false, message: error.message }));
    });
    
app.post('/user/signup', (req, res) => {
    //get du lieu
        const { email, plainPassword, name } = req.body;
        //băm mat khau
        hash(plainPassword, 8)
        // luu db
        .then(encryptedPassword => {
            const user = new User({ name, email, password: encryptedPassword });
            return user.save();
        })
        //send result
        .then(user => res.send({ success: true, user }))
        .catch(error => res.status(400).send({ success: false, message: error.message }));
    });
module.exports = {app};