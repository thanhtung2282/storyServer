// tạo moi trường test
process.env.NODE_ENV = 'test';
// connect database
require('../src/helpers/connectdatabase');
// gọi Story
const { Story } = require('../src/models/story.model');
//chạy
beforeEach('Xoá tất cả dữ liệu để test',async()=>{
    //xoá story
    await Story.remove({});
});