// const jwt = require("jsonwebtoken");

// function auth(req, res, next) {
//   const token = req.header("Authorization")?.split(" ")[1]; // Bearer token
//   if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id: userId }
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// }

// module.exports = auth;


// {middleware/authMiddleware.js}
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, msg: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id }; // make available to controllers
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: 'Invalid token' });
  }
};
module.exports=[auth]
