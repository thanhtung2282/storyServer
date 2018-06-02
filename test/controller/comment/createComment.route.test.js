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
describe.only('test POST/comment',()=>{
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
    it('Có thể comment',async()=>{
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

});