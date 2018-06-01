// suppertest
const  supertest  = require('supertest');
//equal 
const {equal} = require('assert');
//app
const {app} = require('../../../src/app');
//story
const {Story} = require('../../../src/models/story.model');
const {User} = require('../../../src/models/user.model');
const {UserService} =require('../../../src/service/user.service');
const {StoryService} =require('../../../src/service/story.service');
//test
describe('test POST/story/like/:_id',()=>{
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
    it('Có thể like story',async()=>{
        const response = await supertest(app).post('/story/like/'+idStory).set({token:token2}).send({});
        // console.log(response.body)
        const {success , story} = response.body;
        equal(success,true);    
        equal(story.fans[0],idUser2);   
        equal(story.author,idUser1); 
        const storyDB = await Story.findOne({}).populate('fans');
        // console.log(storyDB)
        equal(storyDB._id.toString(),idStory);
        equal(storyDB.fans[0]._id.toString(),idUser2);
    });
    it('Không thể like story khi sai idStory',async()=>{
        const response = await supertest(app).post('/story/like/asdasd').set({token:token2}).send({});
        // console.log(response.body)
        const {success , story, message} = response.body;
        equal(success,false); 
        equal(message,'INVALID_ID');
        equal(response.status,400);
        const storyDB = await Story.findOne({}).populate('fans');
        // console.log(storyDB)
        equal(storyDB._id.toString(),idStory);
        equal(storyDB.fans.length,0);
    });
    it('Không thể like story khi sai không có token',async()=>{
        const response = await supertest(app).post('/story/like/'+idStory).send({});
        // console.log(response.body)
        const {success , story, message} = response.body;
        equal(success,false); 
        equal(message,'INVALID_TOKEN');    
        equal(response.status,400);
        const storyDB = await Story.findOne({}).populate('fans');
        // console.log(storyDB)
        equal(storyDB._id.toString(),idStory);
        equal(storyDB.fans.length,0);
    });
    it('Không thể like story khi sai story đã xoá',async()=>{
        await StoryService.removeStory(idUser1, idStory);
        const response = await supertest(app).post('/story/like/'+idStory).set({token:token2}).send({});
        // console.log(response.body)
        const {success , story, message} = response.body;
        equal(success,false); 
        equal(message,'CANNOT_FIND_STORY');    
        equal(response.status,404);
        const storyDB = await Story.findOne({});
        // console.log(storyDB)
        equal(storyDB,null);
    });
});