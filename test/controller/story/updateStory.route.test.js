// suppertest
const  supertest  = require('supertest');
//equal 
const {equal} = require('assert');
//app
const {app} = require('../../../src/app');
//story
const {Story} = require('../../../src/models/story.model');
//test
describe('test PUT/story/:_id',()=>{
    let idStory;
    beforeEach('Tạo story để test Update', async()=>{
        const story = new Story({content:'abcd'});
        await story.save();
        idStory = story._id;
    });
    it('Có thể update story',async()=>{
        const response = await supertest(app).put('/story/'+idStory).send({content:'AAA'});
        // console.log(response.body)
        const {success , story} = response.body;
        equal(success,true);    
        equal(story.content,'AAA');
        const storyDB = await Story.findOne({});
        equal(storyDB._id.toString(),idStory);
        equal(storyDB.content,'AAA');
    });
    it('Không thể update story khi sai id',async()=>{
        const response = await supertest(app).put('/story/xyz').send({content:'AAA'});
        // console.log(response.body)
        const {success} = response.body;
        equal(success,false);    
        equal(response.status,400);
        const storyDB = await Story.findOne({});
        equal(storyDB._id.toString(),idStory);
        equal(storyDB.content,'abcd');
    });
    it('Không thể update 1 story đã bị xoá ',async()=>{
        await Story.findByIdAndRemove(idStory);
        const response = await supertest(app).put('/story/'+idStory).send({content:'AAA'});
        console.log(response.body)
        const {success,message} = response.body;
        equal(success,false);
        equal(message,'Cannot Find Story');    
        equal(response.status,400);
        const storyDB = await Story.findOne({idStory});
        equal(storyDB,null);
    });
    
});