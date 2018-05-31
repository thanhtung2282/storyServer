// suppertest
const  supertest  = require('supertest');
//equal 
const {equal} = require('assert');
//bcryptjs 
const {compareSync} = require('bcryptjs');
//app
const {app} = require('../../../src/app');
//story
const {User} = require('../../../src/models/user.model');
//test
describe('test POST/user/signup',()=>{
    it('Có thể Signup',async()=>{
        //tao dữ liêu
        const body ={
            email:"test@gmail.com",
            plainPassword:'123',
            name:'TEST'
        }
        //send du lieu
        const response = await supertest(app).post('/user/signup').send(body)
            // console.log(response.body);
        //equal ketqua
        const {success,user} = response.body;
        equal(success,true);
        equal(user.name,'TEST');
        equal(user.email,'test@gmail.com');
        //equal in database
        const userDB = await User.findOne({});
        equal(userDB._id.toString(),user._id);
        equal(userDB.name,'TEST');
        equal(userDB.email,'test@gmail.com');
        const same = compareSync('123',userDB.password)
        equal(same,true);
    });
    it('khong thể signup khi empty email',async()=>{
        //tao dữ liêu
        const body ={
            email:"",
            plainPassword:'123',
            name:'TEST'
        }
        //send du lieu
        const response = await supertest(app).post('/user/signup').send(body)
            // console.log(response.body);
        //equal ketqua
        const {success,user} = response.body;
        equal(success,false);
        equal(response.status,400);
        equal(user,undefined);
        //equal in database
        const userDB = await User.findOne({});
        // console.log(userDB);
        equal(userDB,null);
    });
    it('khong thể signup khi empty name',async()=>{
        //tao dữ liêu
        const body ={
            email:"test@gmail.com",
            plainPassword:'123',
            name:''
        }
        //send du lieu
        const response = await supertest(app).post('/user/signup').send(body)
            // console.log(response.body);
        //equal ketqua
        const {success,user} = response.body;
        equal(success,false);
        equal(response.status,400);
        equal(user,undefined);
        //equal in database
        const userDB = await User.findOne({});
        // console.log(userDB);
        equal(userDB,null);

    });
    it('khong thể signup khi trùng email',async()=>{
        //tao dữ liêu
        const body ={
            email:"test@gmail.com",
            plainPassword:'123',
            name:'TEST'
        }
        //send du lieu
        await supertest(app).post('/user/signup').send(body);
        const response = await supertest(app).post('/user/signup').send(body);
            // console.log(response.body);
        //equal ketqua
        const {success} = response.body;
        equal(success,false);
        equal(response.status,400);
        //equal in database
        const userCount = await User.count();
        // console.log(userCount);
        equal(userCount,1);
    });
});