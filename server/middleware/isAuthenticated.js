const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(401).json({ message: "You are not authenticated" });
    }

    req.user = decodedToken.user;
    next();
  } catch (error) {
    console.log("Error In Middleware :", error.message);
  }
};
module.exports = isAuthenticated;
