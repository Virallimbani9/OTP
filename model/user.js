const mongoose = require('mongoose');

const UserSchema =  mongoose.Schema({
    name: {
        type: String,
        trim: true,
        // required: [true, 'Name is required']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be 6 characters or longer']
    },

    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required']
    },    
    phone: {
        type: Number,
        trim: true,
        // required: [true, 'Phone number is required'],
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },  
    isProfilecomplete:{
        type:Boolean,
        default:false
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    }, 
    otp: {
        type: String,
        trim: true
      },
 });



module.exports = mongoose.model('User', UserSchema);







