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
describe('test DELETE/story/:_id',()=>{
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
    it('Có thể xoá story',async()=>{
        const response = await supertest(app).delete('/story/'+idStory).set({token:token1});
        // console.log(response.body)
        const {success , story} = response.body;
        equal(success,true);    
        equal(story.content,'xyz');
        equal(story.author,idUser1);
        const storyDB = await Story.findById(idStory);
        equal(storyDB,null);
        const userDB = await User.findById(idUser1);
        equal(userDB.stories.length,0);
        // console.log(userDB)
    });
    it('Không thể xoá story khi sai id',async()=>{
        const response = await supertest(app).delete('/story/asda').set({token:token1});
        // console.log(response.body)
        const {success} = response.body;
        equal(success,false);
        equal(response.status,400);
        const storyDB = await Story.findOne({});
        // console.log(storyDB)
        equal(storyDB._id.toString(),idStory);
        equal(storyDB.author.toString(),idUser1);
        const userDB = await User.findById(idUser1);
        equal(userDB.stories.length,1);
    });
    it('Không thể xoá 1 story 2 lần',async()=>{
        await StoryService.removeStory(idUser1,idStory);
        const response = await supertest(app).delete('/story/'+idStory).set({token:token1});
        // console.log(response.body)
        const {success, message} = response.body;
        equal(success,false);
        equal(response.status,400);
        equal(message,'Cannot Find Story');
        const storyDB = await Story.findOne({});
        equal(storyDB,null);
        const userDB = await User.findById(idUser1);
        // console.log(userDB)
        equal(userDB.stories.length,0);
    });
    it('Không thể xoá 1 story khi không có token',async()=>{
        const response = await supertest(app).delete('/story/'+idStory);
        // console.log(response.body)
        const {success, message} = response.body;
        equal(success,false);
        equal(response.status,400);
        equal(message,'invalid token');
        const storyDB = await Story.findOne({});
        equal(storyDB._id.toString(),idStory);
        const userDB = await User.findById(idUser1);
        // console.log(userDB)
        equal(userDB.stories[0].toString(),idStory);
    });
    it('Không thể xoá 1 story khi token sai',async()=>{
        const response = await supertest(app).delete('/story/'+idStory).set({token:token2});
        // console.log(response.body)
        const {success, message} = response.body;
        equal(success,false);
        equal(response.status,400);
        equal(message,'Cannot Find Story');
        const storyDB = await Story.findOne({});
        equal(storyDB._id.toString(),idStory);
        const userDB = await User.findById(idUser1);
        // console.log(userDB)
        equal(userDB.stories[0].toString(),idStory);
    });
});