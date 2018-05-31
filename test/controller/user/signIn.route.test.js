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
describe('test POST/user/signIn',()=>{
    beforeEach('signup for test',async()=>{
        //tao dữ liêu
        const body ={
            email:"test@gmail.com",
            plainPassword:'123',
            name:'TEST'
        }
        //send du lieu
        const response = await supertest(app).post('/user/signup').send(body);
    });
    it('Có thể SignIn',async()=>{
        //tao dữ liêu
        const body ={
            email:"test@gmail.com",
            plainPassword:'123'
        }
        //send du lieu
        const response = await supertest(app).post('/user/signin').send(body);
            // console.log(response.body);
        //equal ketqua
        const {success,user} = response.body;
        equal(success,true);
        equal(user.name,'TEST');
        equal(user.email,'test@gmail.com');
    });
    it('Không thể SignIn khi empty email',async()=>{
        //tao dữ liêu
        const body ={
            email:"",
            plainPassword:'123'
        }
        //send du lieu
        const response = await supertest(app).post('/user/signin').send(body);
            // console.log(response.body);
        //equal ketqua
        const {success,message} = response.body;
        equal(success,false);
        equal(message,'Cannot find user');
        equal(response.status,400);
    });
    it('Không thể SignIn khi sai email',async()=>{
        //tao dữ liêu
        const body ={
            email:"abc@gmail.com",
            plainPassword:'123'
        }
        //send du lieu
        const response = await supertest(app).post('/user/signin').send(body);
            // console.log(response.body);
        //equal ketqua
        const {success,message} = response.body;
        equal(success,false);
        equal(message,'Cannot find user');
        equal(response.status,400);
    });
    it('Không thể SignIn khi không có password',async()=>{
        //tao dữ liêu
        const body ={
            email:"test@gmail.com",
            plainPassword:''
        }
        //send du lieu
        const response = await supertest(app).post('/user/signin').send(body);
            // console.log(response.body);
        //equal ketqua
        const {success,message} = response.body;
        equal(success,false);
        equal(message,'Invalid password');
        equal(response.status,400);
    });
    it('Không thể SignIn khi sai password',async()=>{
        //tao dữ liêu
        const body ={
            email:"test@gmail.com",
            plainPassword:'abc'
        }
        //send du lieu
        const response = await supertest(app).post('/user/signin').send(body);
            // console.log(response.body);
        //equal ketqua
        const {success,message} = response.body;
        equal(success,false);
        equal(message,'Invalid password');
        equal(response.status,400);
    });
});