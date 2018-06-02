const {Router} = require('express');
const {CommentService} =require('../service/comment.service');
const {mustBeUser} = require('./mustBeUser.middleware');
const commentRouter = Router();
//middle ware
commentRouter.use(mustBeUser);
//tạo comment
commentRouter.post('/', (req, res) => {
    //get du lieu
    const { idStory,content } = req.body;
    CommentService.createComment(req.idUser,idStory,content)
    .then(comment  =>  res.send({ success: true, comment  }))
    .catch(res.onError);
});
//update
commentRouter.put('/:_id', (req, res) => {
    //get du lieu
    const { content } = req.body;
    CommentService.updateComment(req.idUser,req.params._id,content)
    .then(comment  =>  res.send({ success: true, comment  }))
    .catch(res.onError);
});
module.exports = {commentRouter};