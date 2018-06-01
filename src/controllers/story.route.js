const {Router} = require('express');
const {StoryService} =require('../service/story.service');
const {mustBeUser} =require('../controllers/mustBeUser.middleware');
const storyRouter = Router();
//middleware
storyRouter.use(mustBeUser);
// lấy tất cả story
storyRouter.get('/',(req,res)=>{
    StoryService.then((stories)=>res.send({success:true, stories}));
})
// tạo mới story
storyRouter.post('/',(req,res)=>{
    // lấy các giá trị được gữi lên
    const { content } = req.body;
    StoryService.createStory(req.idUser,content)
    .then((story)=>{res.send({success:true , story})})
    .catch(res.onError);  
});
// sửa story
storyRouter.put('/:_id',(req,res)=>{
    // lấy các giá trị dc gửi lên
    const {content} = req.body;
    StoryService.updateStory(req.idUser,req.params._id,content)
    .then((story) => res.send({success:true, story}))
    .catch(res.onError); 
});
//delete story
storyRouter.delete('/:_id',(req,res)=>{
    StoryService.removeStory(req.idUser,req.params._id)
    .then((story) => res.send({success:true, story}))
    .catch(res.onError); 
});
module.exports = {storyRouter};