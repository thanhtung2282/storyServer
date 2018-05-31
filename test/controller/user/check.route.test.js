// suppertest
const  supertest  = require('supertest');
//equal 
const {equal} = require('assert');
//bcryptjs 
const {compareSync} = require('bcryptjs');
//token
const {verify} = require('../../../src/helpers/jwt');
//app
const {app} = require('../../../src/app');
//story
const {User} = require('../../../src/models/user.model');
const {UserService} = require('../../../src/service/user.service');
//test
describe.only('test GET/check',()=>{
        let token, _id;
        beforeEach('Sign up user for test', async () => {
            await UserService.SignUp('teo@gmail.com', '123', 'Teo Nguyen');
            const user = await UserService.SignIn('teo@gmail.com', '123');
            token = user.token;
            _id = user._id;
        });
    it('Có thể login check',async()=>{
        const response = await supertest(app).get('/user/check').set({ token });
            // console.log(response.body);
        //equal ketqua
        const {success,user} = response.body;
        equal(success,true);
        equal(user.name,'Teo Nguyen');
        equal(user.email,'teo@gmail.com');
        equal(user.password,undefined);
        const verifyToken = await verify(user.token);
        equal(_id,verifyToken._id);
    });
    it('không thể login check với không có token',async()=>{
        const response = await supertest(app).get('/user/check');
            // console.log(response.body);
        //equal ketqua
        const {success,message} = response.body;
        equal(success,false);
        equal(message,'jwt must be provided');

    });
    it('không thể login check với empty token',async()=>{
        const response = await supertest(app).get('/user/check').set({token:''});
            // console.log(response.body);
        //equal ketqua
        const {success,message} = response.body;
        equal(success,false);
        equal(message,'jwt must be provided');

    });
    it('không thể login check với user đã xoá',async()=>{
        await User.findByIdAndRemove(_id);
        const response = await supertest(app).get('/user/check').set({token});
            // console.log(response.body);
        //equal ketqua
        const {success,message} = response.body;
        equal(success,false);
        equal(message,'Cannot find user');

    });
});