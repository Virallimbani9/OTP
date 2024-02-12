const jwt = require('jsonwebtoken');
const User = require("../model/user");
require('dotenv').config();

async function authenticateToken(req, res, next) {
  const token = req.cookies.token || req.params.token || req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.send('Access denied');
  }

  try {
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decodedData.id });

    if (!user) {
       return res.send('Access denied');
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).send('Invalid token');
  }
}

module.exports = authenticateToken;
