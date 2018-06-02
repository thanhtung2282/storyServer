const express =require('express');
const {json} = require('body-parser');
const {storyRouter} = require('./controllers/story.route');
const {userRouter} = require('./controllers/user.route');
const {commentRouter} = require('./controllers/comment.route');
const app = express();
//middleware json
app.use(json());
//onError middleware
app.use((req,res,next)=>{
    res.onError = function(error) {
        const body = {success:false, message:error.message};
        if(!error.statusCode) console.log(error);
        res.status(error.statusCode || 500).send(body);
    }
    next();
});
//story
app.use('/story',storyRouter);
//user 
app.use('/user',userRouter);
//comment
app.use('/comment',commentRouter);
module.exports = {app};