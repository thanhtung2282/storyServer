const {Router} = require('express');
const {UserService} =require('../service/user.service');
const {mustBeUser} = require('./mustBeUser.middleware');
const userRouter = Router();
// lấy tất cả story
//signUP
userRouter.post('/signin', (req, res) => {
    //get du lieu
    const { email, plainPassword } = req.body;
    UserService.SignIn(email, plainPassword)
    .then(user =>  res.send({ success: true, user }))
    .catch(res.onError);
});
    
userRouter.post('/signup', (req, res) => {
    //get du lieu
    const { email, plainPassword, name } = req.body;
    UserService.SignUp( email, plainPassword, name )
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});
userRouter.get('/check',mustBeUser, (req, res) => {
    //check
    UserService.check(req.idUser)
    .then(user =>  res.send({ success: true, user }))
    .catch(res.onError);
});
module.exports = {userRouter};