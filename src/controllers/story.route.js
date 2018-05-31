const {Router} = require('express');
const {StoryService} =require('../service/story.service')
const storyRouter = Router();
// lấy tất cả story
storyRouter.get('/',(req,res)=>{
    StoryService.then((stories)=>res.send({success:true, stories}));
})
// tạo mới story
storyRouter.post('/',(req,res)=>{
    // lấy các giá trị được gữi lên
    const { content } = req.body;
    StoryService.createStory(content)
    .then((story)=>{res.send({success:true , story})})
    .catch((error)=>res.status(400).send({success:false, message:error.message}));  
});
// sửa story
storyRouter.put('/:_id',(req,res)=>{
    // lấy các giá trị dc gửi lên
    const {content} = req.body;
    //sửa 
    StoryService.updateStory(req.params._id,content)
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