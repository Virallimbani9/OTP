const User = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/mail');


// -------------------------- SIGN --------------------------

signUp = async (req, res) => {
    const {email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = new User({email,password: hashedPassword});
      await user.save();
      res.json({statusCode:'200',message:'Sign Up Done'})
        } catch (error) {
          console.log(error)
      res.json({statusCode:'404',message:'Error creating user'})
    }
};

// -------------------------- LOGIN --------------------------

logIn = async (req, res) => {

 const { email, password } = req.body;
 const user = await User.findOne({ email });

    try {
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id },process.env.SECRET_KEY);
        res.cookie("token",token)
     
        if(user.isOtpVerified==false){
          res.json({statusCode:'201',message: 'OTP not verified'})
        } else if(user.isProfilecomplete==false){
          res.json({statusCode:'202',message: 'Profile not completed'})
        }else{
          res.json({statusCode:'200',message: 'Logged in' ,token:token})
        } 
      } else {
        res.status(404).send('Invalid username or password');
      }
    } catch (error) {
      console.log(error);
      res.send('Error logging in');
    }
    };

logOut = async (req, res) => {

  res.clearCookie("token")
  res.json({statusCode:'200',message:'Logout'})
}

// -------------------------- OTP --------------------------

sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.json({statusCode :'404',message:'User not found'})
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpToken = jwt.sign({ userId: user._id, otp }, process.env.OTP_SECRET_KEY, { expiresIn: '1m' });

  user.otp = otpToken;
  user.otpCreatedAt = new Date();  
  await user.save();
  const option = {
    email: user.email,
    subject: 'OTP for Verification',
    message: `Your OTP for Verfication is ${otp}`,
  };
  sendMail(option);
  res.json({statusCode :'200',message:'OTP Send'})
}

verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
      return res.json({statusCode :'404',message:'User not found'})
  }

  try {
      
      const decoded = jwt.verify(user.otp, process.env.OTP_SECRET_KEY);

      if (decoded.otp === otp) {
          await User.findOneAndUpdate({isOtpVerified: true})
          return res.json({statusCode :'200',message:'OTP verified'});
      } else {
          return res.json({statusCode :'401',message:'Invalid OTP'})
      }
  } catch (error) {
      console.error(error);
      return res.json({statusCode:'500',message:"Internal Server Error"})
  }
};

completeProfile = async (req, res) => {
  const { name,phone } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({statusCode :'404',message:'User not found'})
    }
    user.name = name;
    user.phone = phone;
    
    await User.findOneAndUpdate({isProfilecomplete: true})
    await user.save();

    res.json({statusCode :'200',message:'Profile completed successfully'});
  } catch (error) {
    console.error(error);
    res.json({statusCode:'500',message:"Internal Server Error"})
  }
};

index = async (req, res) => {
 res.send("Welcome To Home");
}



module.exports = {
    signUp,
    logIn,
    logOut,
    sendOtp,
    verifyOtp,
    completeProfile,
    index
}
