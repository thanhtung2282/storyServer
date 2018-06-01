const {Story} = require('../models/story.model');
const {User} = require('../models/user.model');
class StoryService{
    static getAll(){
        return Story.find({});
    }
    static async createStory(idUser,content){
        const story = new Story({content, author:idUser});//create story
        // lưu id Story vào stories của user
        await User.findByIdAndUpdate(idUser,{$push : {stories:story._id}})
        //lưu story
        return story.save();
    }
    static async updateStory(idUser,_idStory,content){
        const story =  await Story.findOneAndUpdate({_id:_idStory, author:idUser},{content}, {new:true});
        if(!story) throw new Error('Cannot Find Story');
        return story;
    }
    static async removeStory(idUser,_idStory){
        const query = { _id:_idStory, author: idUser };
        const story =  await Story.findOneAndRemove(query);
        if(!story) throw new Error('Cannot Find Story');
        await User.findOneAndUpdate(idUser,{ $pull :{stories:_idStory} });
        return story;
    }
}
module.exports = {StoryService}