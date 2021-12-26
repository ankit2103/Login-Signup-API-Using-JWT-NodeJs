const express    = require('express');
const app        = express();
const userRoute      = require('./api/user');

const mongoose   = require('mongoose');
const bodyParser = require('body-parser');


mongoose.connect('mongodb+srv://Ankit2101:Ankit2000@cluster0.vswyd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

mongoose.connection.on('error',err=>{
  console.log('connection failed'); 
})

mongoose.connection.on('connected',connected=>{
  console.log('connected with database....');
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use('/user',userRoute)


app.use((req,res,next)=>{
    res.status(404).json({
        message:"Invalid Request"
    })
})

module.exports = app;