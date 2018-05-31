// tạo moi trường test
process.env.NODE_ENV = 'test';
// connect database
require('../src/helpers/connectdatabase');
// gọi Story
const { Story } = require('../src/models/story.model');
// gọi user
const { User } = require('../src/models/user.model');
//chạy
beforeEach('Xoá tất cả dữ liệu để test',async()=>{
    //xoá story
    await Story.remove({});
    //xoá user
    await User.remove({});
});