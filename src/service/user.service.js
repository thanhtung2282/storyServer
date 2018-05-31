
const { hash, compare} = require('bcryptjs');

const {User} = require('../models/user.model');

class UserService {
    static async SignIn (email, plainPassword){
        //find by email
        const user = await User.findOne({email});
        //check user
        if(!user) throw new Error('Cannot find user');
        const same = await compare(plainPassword,user.password);
        if(!same) throw new Error('Invalid password');
        return user;

    }
    static async SignUp(email, plainPassword, name ){
        const password = await  hash(plainPassword, 8);
        const user = new User({ name, email, password });
        return user.save();
    }
}
module.exports = {UserService};