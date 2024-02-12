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
      res.status(200).send('User created');
      console.log('Status Code:', res.statusCode);
        } catch (error) {
          console.log(error)
      res.status(404).send('Error creating user');
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
        res.status(200).send('Logged in');   
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
  res.send('Logged out');
}

sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).send('User not found');
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  user.otp = otp;
  user.otpCreatedAt = new Date();
  
  await user.save();
  const option = {
    email: user.email,
    subject: 'OTP for Verification',
    message: `Your OTP for Verfication is ${otp}`,
  };
  sendMail(option);
  res.status(200).send('OTP sent');
}

verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).send('User not found');
  } else if (user.otp == otp) {
    res.status(200).send('OTP verified');
  } else if (user.otp != otp) {
    res.status(401).send('Invalid OTP');
  }
}



module.exports = {
    signUp,
    logIn,
    logOut,
    sendOtp,
    verifyOtp
}
