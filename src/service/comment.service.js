const {Story} = require('../models/story.model');
const {User} = require('../models/user.model');
const {Comment} = require('../models/comment.model');
const {MyError} = require('../models/my-error.model');
const {checkObjectId} = require('../helpers/checkObjectId');

class CommentService{
    //tao new comment
    static async createComment(idUser,idStory,content){
        if(!content) throw new MyError('INVALID_CONTENT',400);
        //save comment. user and content
        const comment = new Comment({author:idUser,content});
        //save in story
        const updateObj = {$push:{comments:comment._id}};
        const story = await  Story.findByIdAndUpdate(idStory,updateObj);
        if(!story) throw new MyError('CANNOT_FIND_STORY',404);
        await comment.save();
        return comment;
    }
}
module.exports = {CommentService}