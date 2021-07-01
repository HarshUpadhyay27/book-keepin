const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    }
})

//populating books the user created

userSchema.virtual('books', {
    ref:'Book',
    foreignField:'createdBy',
    localField:'_id'
})
userSchema.set('toJSON', {virtuals: true})

userSchema.pre('save', async function(next){
    // const salt = await bcrypt.getSalt(10)
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// compair password
userSchema.methods.isPasswordMatch = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}

const User = new mongoose.model('User', userSchema)
module.exports = User