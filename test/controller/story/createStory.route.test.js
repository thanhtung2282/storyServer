// suppertest
const  supertest  = require('supertest');
//equal 
const {equal} = require('assert');
//app
const {app} = require('../../../src/app');
//story
const {Story} = require('../../../src/models/story.model');
const {User} = require('../../../src/models/user.model');
const {UserService} = require('../../../src/service/user.service');
//test
describe('test POST/story',()=>{
    let token, _id;
    beforeEach('Sign up user for test', async () => {
        await UserService.SignUp('teo@gmail.com', '123', 'Teo Nguyen');
        const user = await UserService.SignIn('teo@gmail.com', '123');
        token = user.token;
        _id = user._id;
    });
    it.only('Có thể tạo mới story',async()=>{
        // send du lieu
        const response = await supertest(app).post('/story').set({token}).send({content : 'ABCD'});
        console.log(response.body);
        // const {success, story} = response.body;
        // // kiem tra hợp lệ
        // equal(success,true);
        // equal(story.content,'ABCD');
        // //kiem tra trong db
        const storyDB =  await Story.findOne({}).populate('author');
        console.log(storyDB);
        const userDB =  await User.findById(_id);
        console.log(userDB);
        // // kiem tra hợp lệ
        // equal(storyDB.content,'ABCD');
        // equal(storyDB._id,story._id);
    });
    it('không thể tạo mới story khi không có content',async()=>{
        // send du lieu
        const response = await supertest(app).post('/story').send({content : ''});
        // get dulieu  
        // console.log(response.body);
        const {success, story} = response.body;
        // kiem tra hợp lệ
        equal(success,false);
        equal(story,undefined);
        equal(response.status,400);
        //kiem tra trong db
        const storyDB =  await Story.findOne({});
        // kiem tra hợp lệ
        equal(storyDB,null);
    });
});