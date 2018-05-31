const express =require('express');
const {json} = require('body-parser');
const {Story} = require('./models/story.model');
const {storyRouter} = require('./controllers/story.route');
const {userRouter} = require('./controllers/user.route');
const app = express();
//middleware json
app.use(json());
//story
app.use('/story',storyRouter);
//user 
app.use('/user',userRouter);
module.exports = {app};