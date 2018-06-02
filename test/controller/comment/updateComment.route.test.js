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
const {CommentService} =require('../../../src/service/comment.service');
//test
describe('test POST/story/like/:_id',()=>{
    let token1, token2, idUser1, idUser2, idStory, idComment;
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
        //comment
        const comment = await CommentService.createComment(idUser2, idStory, 'abc');
        idComment = comment._id;
    });
    it('Có thể update comment',async()=>{
        const response = await supertest(app).put('/comment/'+idComment).set({token:token2}).send({content:'UPDATE'});
        // console.log(response.body)
        const {success , comment} = response.body;
        equal(success,true);    
        equal(comment._id,idComment);   
        equal(comment.author,idUser2); 
        equal(comment.content, 'UPDATE'); 
        const commentDB = await Comment.findById(idComment);
        // console.log(commentDB)
        equal(commentDB._id.toString(),idComment);
        equal(commentDB.author.toString(),idUser2);
        equal(commentDB.content, 'UPDATE');
    });
    it('không thể update comment khi không có content',async()=>{
        const response = await supertest(app).put('/comment/'+idComment).set({token:token2}).send({content:''});
        // console.log(response.body)
        const {success , comment,message} = response.body;
        equal(success,false);    
        equal(message,'INVALID_CONTENT');   
        equal(response.status,400);   
        const commentDB = await Comment.findById(idComment);
        // console.log(commentDB)
        equal(commentDB._id.toString(),idComment);
        equal(commentDB.author.toString(),idUser2);
        equal(commentDB.content, 'abc');
    });
    it('không thể update comment với token1',async()=>{
        const response = await supertest(app).put('/comment/'+idComment).set({token:token1}).send({content:'UPDATE'});
        // console.log(response.body)
        const {success , comment,message} = response.body;
        equal(success,false);    
        equal(message,'CANNOT_FIND_COMMENT');   
        equal(response.status,404);   
        const commentDB = await Comment.findById(idComment);
        // console.log(commentDB)
        equal(commentDB._id.toString(),idComment);
        equal(commentDB.author.toString(),idUser2);
        equal(commentDB.content, 'abc');
    });
    it('không thể update comment với không có token',async()=>{
        const response = await supertest(app).put('/comment/'+idComment).set({token:''}).send({content:'UPDATE'});
        // console.log(response.body)
        const {success , comment,message} = response.body;
        equal(success,false);    
        equal(message,'INVALID_TOKEN');   
        equal(response.status,400);   
        const commentDB = await Comment.findById(idComment);
        // console.log(commentDB)
        equal(commentDB._id.toString(),idComment);
        equal(commentDB.author.toString(),idUser2);
        equal(commentDB.content, 'abc');
    });
    it('không thể update comment khi sai idComent',async()=>{
        const response = await supertest(app).put('/comment/asdasd').set({token:token2}).send({content:'UPDATE'});
        // console.log(response.body)
        const {success , comment,message} = response.body;
        equal(success,false);    
        equal(message,'INVALID_ID');   
        equal(response.status,400);   
        const commentDB = await Comment.findById(idComment);
        // console.log(commentDB)
        equal(commentDB._id.toString(),idComment);
        equal(commentDB.author.toString(),idUser2);
        equal(commentDB.content, 'abc');
    });
    it('không thể update comment khi comment đã xoa',async()=>{
        await Comment.findByIdAndRemove(idComment);
        const response = await supertest(app).put('/comment/'+idComment).set({token:token2}).send({content:'UPDATE'});
        // console.log(response.body)
        const {success , comment,message} = response.body;
        equal(success,false);    
        equal(message,'CANNOT_FIND_COMMENT');   
        equal(response.status,404);   
        const commentDB = await Comment.findById(idComment);
        // console.log(commentDB)
        equal(commentDB,null);
    });
});