const {Router} = require('express');
const {verify} = require('../helpers/jwt');
const {StoryService} =require('../service/story.service');
const storyRouter = Router();
// lấy tất cả story
storyRouter.get('/',(req,res)=>{
    StoryService.then((stories)=>res.send({success:true, stories}));
})
// tạo mới story
storyRouter.post('/',(req,res)=>{
    // lấy các giá trị được gữi lên
    const { content } = req.body;
    //verify token được gui đế lấy _id user
    verify(req.headers.token)
    .then(obj => StoryService.createStory(obj._id,content) )
    .then((story)=>{res.send({success:true , story})})
    .catch((error)=>res.status(400).send({success:false, message:error.message}));  
});
// sửa story
storyRouter.put('/:_id',(req,res)=>{
    // lấy các giá trị dc gửi lên
    const {content} = req.body;
    verify(req.headers.token) 
    .then(obj => StoryService.updateStory(obj._id,req.params._id,content))
    .then((story) => res.send({success:true, story}))
    .catch((error)=> res.status(400).send({success:false, message:error.message}));
});
//delete story
storyRouter.delete('/:_id',(req,res)=>{
    StoryService.removeStory(req.params._id)
    .then((story) => res.send({success:true, story}))
    .catch((error)=> res.status(400).send({success:false, message:error.message}));
});
module.exports = {storyRouter};