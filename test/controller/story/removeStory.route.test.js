// suppertest
const  supertest  = require('supertest');
//equal 
const {equal} = require('assert');
//app
const {app} = require('../../../src/app');
//story
const {Story} = require('../../../src/models/story.model');
//test
xdescribe('test DELETE/story/:_id',()=>{
    let idStory;
    beforeEach('Tạo story để test remove', async()=>{
        const story = new Story({content:'abcd'});
        await story.save();
        idStory = story._id;
    });
    it('Có thể xoá story',async()=>{
        const response = await supertest(app).delete('/story/'+idStory);
        // console.log(response.body)
        const {success , story} = response.body;
        equal(success,true);    
        equal(story.content,'abcd');
        const storyDB = await Story.findOne({});
        equal(storyDB,null);
    });
    it('Không thể xoá story khi sai id',async()=>{
        const response = await supertest(app).delete('/story/asda');
        // console.log(response.body)
        const {success} = response.body;
        equal(success,false);
        equal(response.status,400);
        const storyDB = await Story.findOne({});
        equal(storyDB._id.toString(),idStory);
    });
    it('Không thể xoá 1 story 2 lần',async()=>{
        await Story.remove({});
        const response = await supertest(app).delete('/story/'+idStory);
        // console.log(response.body)
        const {success, message} = response.body;
        equal(success,false);
        equal(response.status,400);
        equal(message,'Cannot Find Story');
        const storyDB = await Story.findOne({});
        equal(storyDB,null);
    });
    
});