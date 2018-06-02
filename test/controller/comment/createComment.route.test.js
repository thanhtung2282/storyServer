// suppertest
const  supertest  = require('supertest');
//equal 
const {equal} = require('assert');
//app
const {app} = require('../../../src/app');
//story
const {Story} = require('../../../src/models/story.model');
const {User} = require('../../../src/models/user.model');
const {Comment} = require('../../../src/models/comment.model');
const {UserService} =require('../../../src/service/user.service');
const {StoryService} =require('../../../src/service/story.service');
//test
describe('test POST/comment',()=>{
    let token1, token2, idUser1, idUser2;
    beforeEach('Sign up user for test', async () => {
        //tao user1
        await UserService.SignUp('teo@gmail.com', '123', 'Teo Nguyen');
        const user1 = await UserService.SignIn('teo@gmail.com', '123');
        token1 = user1.token;
        idUser1 = user1._id;
        //tao user2
        await UserService.SignUp('tung@gmail.com', '123', 'tung Nguyen');
        const user2 = await UserService.SignIn('tung@gmail.com', '123');
        token2 = user2.token;
        idUser2 = user2._id;
        //tao story bằng user1
        const story = await StoryService.createStory(idUser1, 'xyz');
        idStory = story._id
    });
    it('Có thể tạo comment',async()=>{
        const response = await supertest(app).post('/comment').set({token:token2}).send({content:'ABC',idStory});
        // console.log(response.body)
        const {success , comment} = response.body;
        equal(success,true);       
        equal(comment.author,idUser2); 
        equal(comment.content,'ABC'); 
        const storyDB = await Story.findOne({}).populate('comments');
        equal(storyDB.comments[0]._id.toString(),comment._id);
        equal(storyDB.comments[0].author.toString(),idUser2);
        const commentDB = await Comment.findOne({}).populate('author');
        // console.log(commentDB)
        equal(commentDB.author._id.toString(),idUser2);
        equal(commentDB.author.name.toString(),'tung Nguyen');
    });
    it('không thể tạo comment khi không có content',async()=>{
        const response = await supertest(app).post('/comment').set({token:token2}).send({content:'',idStory});
        // console.log(response.body)
        const {success, message} = response.body;
        equal(success,false);
        equal(message,'INVALID_CONTENT');       
        equal(response.status,400);  
        const storyDB = await Story.findOne({}).populate('comments');
        // console.log(storyDB)
        equal(storyDB.comments.length,0);
        const commentDB = await Comment.findOne({});
        // console.log(commentDB)
        equal(commentDB,null);
        // equal(commentDB.author.name.toString(),'tung Nguyen');
    });
    it('không thể tạo comment khi không có token',async()=>{
        const response = await supertest(app).post('/comment').send({content:'ABC',idStory});
        // console.log(response.body)
        const {success, message} = response.body;
        equal(success,false);
        equal(message,'INVALID_TOKEN');       
        equal(response.status,400);  
        const storyDB = await Story.findOne({}).populate('comments');
        // console.log(storyDB)
        equal(storyDB.comments.length,0);
        const commentDB = await Comment.findOne({});
        // console.log(commentDB)
        equal(commentDB,null);
        // equal(commentDB.author.name.toString(),'tung Nguyen');
    });
    it('không thể tạo comment khi sai idStory',async()=>{
        const response = await supertest(app).post('/comment').set({token:token2}).send({content:'ABC',idStory:'123'});
        // console.log(response.body)
        const {success, message} = response.body;
        equal(success,false);
        equal(message,'INVALID_ID');       
        equal(response.status,400);  
        const storyDB = await Story.findOne({}).populate('comments');
        // console.log(storyDB)
        equal(storyDB.comments.length,0);
        const commentDB = await Comment.findOne({});
        // console.log(commentDB)
        equal(commentDB,null);
        // equal(commentDB.author.name.toString(),'tung Nguyen');
    });
    it('không thể tạo comment khi đã xoá idStory',async()=>{
        await Story.findByIdAndRemove(idStory);
        const response = await supertest(app).post('/comment').set({token:token2}).send({content:'ABC',idStory});
        // console.log(response.body)
        const {success, message} = response.body;
        equal(success,false);
        equal(message,'CANNOT_FIND_STORY');       
        equal(response.status,404);  
        const storyDB = await Story.findOne({}).populate('comments');
        // console.log(storyDB)
        equal(storyDB,null);
        const commentDB = await Comment.findOne({});
        // console.log(commentDB)
        equal(commentDB,null);
        // equal(commentDB.author.name.toString(),'tung Nguyen');
    });
});