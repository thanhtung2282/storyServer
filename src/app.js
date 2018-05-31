const express =require('express');
const {json} = require('body-parser');
const {Story} = require('./models/story.model');
const {UserService} = require('./service/user.service');
const {StoryService} = require('./service/story.service');
const app = express();
//middleware json
app.use(json());
// lấy tất cả story
app.get('/story',(req,res)=>{
    StoryService.then((stories)=>res.send({success:true, stories}));
})
// tạo mới story
app.post('/story',(req,res)=>{
    // lấy các giá trị được gữi lên
    const { content } = req.body;
    StoryService.createStory(content)
    .then((story)=>{res.send({success:true , story})})
    .catch((error)=>res.status(400).send({success:false, message:error.message}));  
});
// sửa story
app.put('/story/:_id',(req,res)=>{
    // lấy các giá trị dc gửi lên
    const {content} = req.body;
    //sửa 
    StoryService.updateStory(req.params._id,content)
    .then((story) => res.send({success:true, story}))
    .catch((error)=> res.status(400).send({success:false, message:error.message}));
});
//delete story
app.delete('/story/:_id',(req,res)=>{
    StoryService.removeStory(req.params._id)
    .then((story) => res.send({success:true, story}))
    .catch((error)=> res.status(400).send({success:false, message:error.message}));
});
//user 
//signUP
app.post('/user/signin', (req, res) => {
    //get du lieu
        const { email, plainPassword } = req.body;
        UserService.SignIn(email, plainPassword)
        .then(user =>  res.send({ success: true, user }))
        .catch(error => res.status(400).send({ success: false, message: error.message }));
    });
    
app.post('/user/signup', (req, res) => {
    //get du lieu
    const { email, plainPassword, name } = req.body;
    UserService.SignUp( email, plainPassword, name )
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});
module.exports = {app};