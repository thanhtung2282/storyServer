// suppertest
const  supertest  = require('supertest');
//equal 
const {equal} = require('assert');
//app
const {app} = require('../../../src/app');
//story
const {Story} = require('../../../src/models/story.model');
//test
describe('test POST/story',()=>{
    it('Có thể tạo mới story',async()=>{
        // send du lieu
        const response = await supertest(app).post('/story').send({content : 'ABCD'});
        // get dulieu  console.log(response.body);
        const {success, story} = response.body;
        // kiem tra hợp lệ
        equal(success,true);
        equal(story.content,'ABCD');
        //kiem tra trong db
        const storyDB =  await Story.findOne({});
        // kiem tra hợp lệ
        equal(storyDB.content,'ABCD');
        equal(storyDB._id,story._id);
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