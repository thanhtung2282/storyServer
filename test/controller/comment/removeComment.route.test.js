// // suppertest
// const  supertest  = require('supertest');
// //equal 
// const {equal} = require('assert');
// //app
// const {app} = require('../../../src/app');
// //story
// const {Story} = require('../../../src/models/story.model');
// const {User} = require('../../../src/models/user.model');
// const {Comment} = require('../../../src/models/comment.model');
// const {UserService} =require('../../../src/service/user.service');
// const {StoryService} =require('../../../src/service/story.service');
// const {CommentService} =require('../../../src/service/comment.service');
// //test
// describe.only('test DELETE/:_id',()=>{
//     let token1, token2, idUser1, idUser2, idStory, idComment;
//     beforeEach('Sign up user for test', async () => {
//         //tao user1
//         await UserService.SignUp('teo@gmail.com', '123', 'Teo Nguyen');
//         const user1 = await UserService.SignIn('teo@gmail.com', '123');
//         token1 = user1.token;
//         idUser1 = user1._id;
//         //tao user2
//         await UserService.SignUp('tung@gmail.com', '123', 'tung Nguyen');
//         const user2 = await UserService.SignIn('tung@gmail.com', '123');
//         token2 = user2.token;
//         idUser2 = user2._id;
//         //tao story bằng user1
//         const story = await StoryService.createStory(idUser1, 'xyz');
//         idStory = story._id
//         //comment
//         const comment = await CommentService.createComment(idUser2, idStory, 'abcd');
//         idComment = comment._id;
//     });
//     it('Có thể delete comment',async()=>{
//         const response = await supertest(app).delete('/comment/'+idComment).set({token:token2});
//         console.log(response.body)
//         // const {success , comment} = response.body;
//         // equal(success,true);    
//         // equal(comment._id,idComment);   
//         // equal(comment.author,idUser2); 
//         // equal(comment.content, 'UPDATE'); 
//         // const commentDB = await Comment.findById(idComment);
//         // // console.log(commentDB)
//         // equal(commentDB._id.toString(),idComment);
//         // equal(commentDB.author.toString(),idUser2);
//         // equal(commentDB.content, 'UPDATE');
//     });

// });