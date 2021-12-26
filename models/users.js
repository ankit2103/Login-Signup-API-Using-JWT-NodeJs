const mongoose   = require('mongoose')

userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    UserName:String,
    Password:String,
    Phone:Number,
    Email:String,
    UserType:String
})


module.exports = mongoose.model('User',userSchema);