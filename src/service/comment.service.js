const {Story} = require('../models/story.model');
const {User} = require('../models/user.model');
const {Comment} = require('../models/comment.model');
const {MyError} = require('../models/my-error.model');
const {checkObjectId} = require('../helpers/checkObjectId');

class CommentService{
    //tao new comment
    static async createComment(idUser,idStory,content){
        checkObjectId(idUser,idStory);
        if(!content) throw new MyError('INVALID_CONTENT',400);
        //save comment. user and content
        const comment = new Comment({author:idUser,content,story:idStory});
        //save in story
        const updateObj = {$push:{comments:comment._id}};
        const story = await  Story.findByIdAndUpdate(idStory,updateObj);
        if(!story) throw new MyError('CANNOT_FIND_STORY',404);
        await comment.save();
        return comment;
    }
    static async updateComment(idUser,_id,content){ 
        checkObjectId(idUser,_id);
        if(!content) throw new MyError('INVALID_CONTENT',400);
        const query = {_id,author:idUser};
        const comment = await Comment.findOneAndUpdate(query,{content},{new:true});
        if(!comment) throw new MyError('CANNOT_FIND_COMMENT',404);
        return comment;
    }
    static async removeComment(idUser,_id){ 
        checkObjectId(idUser,_id);
        const query = {_id,author:idUser};
        const comment = await Comment.findOneAndRemove(query);
        if(!comment) throw new MyError('CANNOT_FIND_COMMENT',404);
        //xong trong story
        await Story.findByIdAndUpdate(comment.story, { $pull: { comments: _id } });
        return comment;
    }
}
module.exports = {CommentService}