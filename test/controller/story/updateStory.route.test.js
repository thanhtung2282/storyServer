// suppertest
const  supertest  = require('supertest');
//equal 
const {equal} = require('assert');
//app
const {app} = require('../../../src/app');
//story
const {Story} = require('../../../src/models/story.model');
const {UserService} =require('../../../src/service/user.service');
const {StoryService} =require('../../../src/service/story.service');
//test
describe('test PUT/story/:_id',()=>{
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
    it('Có thể update story',async()=>{
        const response = await supertest(app).put('/story/'+idStory).set({token:token1}).send({content:'AAA'});
        // console.log(response.body)
        const {success , story} = response.body;
        equal(success,true);    
        equal(story.content,'AAA');
        const storyDB = await Story.findOne({}).populate('author');
        // console.log(storyDB)
        equal(storyDB._id.toString(),idStory);
        equal(storyDB.content,'AAA');
        equal(storyDB.author._id.toString(),idUser1);
        equal(storyDB.author.stories[0].toString(),idStory);
    });
    it('Không thể update story khi sai idstory',async()=>{
        const response = await supertest(app).put('/story/xyz').set({token:token1}).send({content:'AAA'});
        // console.log(response.body)
        const {success} = response.body;
        equal(success,false);    
        equal(response.status,400);
        const storyDB = await Story.findOne({});
        // console.log(storyDB)
        equal(storyDB._id.toString(),idStory);
        equal(storyDB.content,'xyz');
    });
    it('Không thể update 1 story đã bị xoá ',async()=>{
        await Story.findByIdAndRemove(idStory);
        const response = await supertest(app).put('/story/'+idStory).set({token:token1}).send({content:'AAA'});
        // console.log(response.body)
        const {success,message} = response.body;
        equal(success,false);
        equal(message,'Cannot Find Story');    
        equal(response.status,400);
        const storyDB = await Story.findOne({});
        equal(storyDB,null);
    });
    it('Không thể update 1 story voi token2 ',async()=>{
        const response = await supertest(app).put('/story/'+idStory).set({token:token2}).send({content:'AAA'});
        // console.log(response.body)
        const {success,message} = response.body;
        equal(success,false);
        equal(message,'Cannot Find Story');    
        equal(response.status,400);
        const storyDB = await Story.findOne({});
        // console.log(storyDB)
        equal(storyDB.content,'xyz');
    });
    it('Không thể update 1 story voi không có token ',async()=>{
        const response = await supertest(app).put('/story/'+idStory).send({content:'AAA'});
        // console.log(response.body)
        const {success,message} = response.body;
        equal(success,false);
        equal(message,'jwt must be provided');    
        equal(response.status,400);
        const storyDB = await Story.findOne({});
        equal(storyDB.content,'xyz');
    });
    
});