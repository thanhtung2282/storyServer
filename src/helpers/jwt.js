const jwt = require('jsonwebtoken');
const SECRET_KET = 'BiMaT';

function sign(obj){
    return new Promise((resolve,reject)=>{
        jwt.sign(obj,SECRET_KET,{expiresIn:"2 days"},(error,token)=>{
            if(error) return reject(error);
            return resolve(token);
        });
    });
}
function verify(token){
    return new Promise((resolve,reject)=>{
        jwt.verify(token,SECRET_KET,(error,obj)=>{
            if(error) return reject(error);
            delete obj.exp;
            delete obj.iat;
            return resolve(obj);
        });
    });
}