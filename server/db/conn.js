const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useNewUrlParser:true
}).then(()=>{
    console.log('connection sucessfull');
}).catch((e)=>{
    console.log(e);
})