const jwt = require('jsonwebtoken');
const User = require("../model/user");
require('dotenv').config();

async function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.params.token;

  if (!token) {
    return res.json({statuscode:'403',message:'Access denied'})
  }

  try {
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decodedData.id });

    if (!user) {
       return res.json({statuscode:'403',message:'Access denied'})
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res.json({statuscode:'403',message:'Invalid token'})
  }
}

module.exports = authenticateToken;
