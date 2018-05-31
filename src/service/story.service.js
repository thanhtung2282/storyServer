const {Story} = require('../models/story.model');

class StoryService{
    static getAll(){
        return Story.find({});
    }
    static createStory(content){
        const story = new Story({content});
        return story.save();
    }
    static async updateStory(_idStory,content){
        const story =  await Story.findByIdAndUpdate(_idStory,{content}, {new:true})
        if(!story) throw new Error('Cannot Find Story');
        return story;
    }
    static async removeStory(_idStory){
        const story =  await Story.findByIdAndRemove(_idStory)
        if(!story) throw new Error('Cannot Find Story');
        return story;
    }
}
module.exports = {StoryService}