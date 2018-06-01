
const { hash, compare} = require('bcryptjs');
const {sign, verify} = require('../helpers/jwt');
const {User} = require('../models/user.model');
const {MyError} = require('../models/my-error.model');
class UserService {
    static async SignIn (email, plainPassword){
        if(!email) throw new MyError('INVALID_EMAIL',400);
        //find by email
        const user = await User.findOne({email});
        //check user
        if(!user) throw new MyError('CANNOT_FIND_USER',404);
        const same = await compare(plainPassword,user.password);
        if(!same) throw new MyError('INVALID_PASSWORD',400);
        const userInfo = user.toObject();
        //xoa pass
        delete userInfo.password;
        //them token
        userInfo.token = await sign({_id:user._id});
        return userInfo;

    }
    static async SignUp(email, plainPassword , name){
        if(!plainPassword) throw new MyError('INVALID_PASSWORD',400);
        try {
            const password = await  hash(plainPassword, 8);
            const user = new User({ name, email, password });
            await user.save();
            //xoa pass
            const userInfo = user.toObject();
            delete userInfo.password;
            return userInfo;
        } catch (error) {
            // console.log(error.name)
            if(error.name === 'ValidationError') throw new MyError('INVALID_USER_INFO',400);
            throw new MyError('EMAIL_EXISSTED',400);

  
        }
    }
    static async check(idUser){
        //kiểm tra có tồn tại
        const user = await User.findById(idUser);
        //ko có lỗi
        if(!user) throw new MyError('CANNOT_FIND_USER',404);
        // bỏ token
        const userInfo = user.toObject();
        delete userInfo.password;
        userInfo.token = await sign({_id:user._id});
        return userInfo;
    }
}
module.exports = {UserService};