require('./helpers/connectdatabase');
const {app} = require('./app');
app.listen(3000,()=>console.log('Connected Server'));