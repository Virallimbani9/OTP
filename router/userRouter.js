const express = require("express");
const router=express.Router()
const userCon=require('../controller/userCon')
const authenticateToken = require('../middleware/auth');

// -------------------------- SIGN --------------------------
router.post('/signup',userCon.signUp)

// -------------------------- LOGIN --------------------------
router.get('/logout',userCon.logOut)
router.post('/login',userCon.logIn)

// -------------------------- OTP --------------------------
router.post('/sendotp',userCon.sendOtp)
router.post('/verifyotp',userCon.verifyOtp)




module.exports=router