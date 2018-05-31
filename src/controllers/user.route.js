const {Router} = require('express');
const {UserService} =require('../service/user.service')
const userRouter = Router();
// lấy tất cả story
//signUP
userRouter.post('/signin', (req, res) => {
    //get du lieu
    const { email, plainPassword } = req.body;
    UserService.SignIn(email, plainPassword)
    .then(user =>  res.send({ success: true, user }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});
    
userRouter.post('/signup', (req, res) => {
    //get du lieu
    const { email, plainPassword, name } = req.body;
    UserService.SignUp( email, plainPassword, name )
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(400).send({ success: false, message: error.message }));
});
module.exports = {userRouter};