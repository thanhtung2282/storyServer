const {Story} = require('../models/story.model');
const {User} = require('../models/user.model');
const {MyError} = require('../models/my-error.model');
const { Comment } = require('../models/comment.model');
const {checkObjectId} = require('../helpers/checkObjectId');

class StoryService{
    static getAll(){
        return Story.find({});
    }
    static async createStory(idUser,content){
        if(!content) throw new MyError("CONTENT_MUST_BE_PROVIDE",400);
        const story = new Story({content, author:idUser});//create story
        // lưu id Story vào stories của user
        await User.findByIdAndUpdate(idUser,{$push : {stories:story._id}})
        //lưu story
        return story.save();
    }
    static async updateStory(idUser,_idStory,content){
        checkObjectId(idUser,_idStory);
        const story =  await Story.findOneAndUpdate({_id:_idStory, author:idUser},{content}, {new:true});
        if(!story) throw new MyError('CANNOT_FIND_STORY',404);
        return story;
    }
    static async removeStory(idUser,_idStory){
        checkObjectId(idUser,_idStory);
        const query = { _id:_idStory, author: idUser };
        const story =  await Story.findOneAndRemove(query);
        if(!story) throw new MyError('CANNOT_FIND_STORY',404);
        await Comment.remove({ _id: { $in: story.comments } });
        await User.findOneAndUpdate(idUser,{ $pull :{stories:_idStory} });
        return story;
    }
    static async likeStory(idUser,_idStory){
        //check id
        checkObjectId(idUser,_idStory);

        const query = {_id:_idStory,fans:{$ne:idUser}};;
        //update fans vào story
        const story = await Story.findOneAndUpdate(query,{$addToSet:{fans:idUser}},{new:true})
        if(!story) throw new MyError('CANNOT_FIND_STORY',404);
        return story;
    }
    static async dislikeStory(idUser,_idStory){
        //check id
        checkObjectId(idUser,_idStory);

        const query = {_id:_idStory,fans:{$eq:idUser}};;
        //update fans vào story
        const story = await Story.findOneAndUpdate(query,{$pull:{fans:idUser}},{new:true})
        if(!story) throw new MyError('CANNOT_FIND_STORY',404);
        return story;
    }
}
module.exports = {StoryService}