const jwt = require('jsonwebtoken');

const tokenVerification = (req, res, next) => {
  console.log(
    `authentication.middleware | tokenVerification | ${req?.originalUrl}`
  );
  try {
    if (req?.originalUrl.endsWith("/login")) {
      console.log('Skip token verification')
      return next();
    }

    var token = req.headers['authorization'];

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token?.length);
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
          res.status(401).json({
            status: false,
            message: err?.name ? err?.name : "Invalid token",
            error: `Invalid token | ${err?.message}`,
          });
        } else {
          req.user = decoded;
          // Check if the user's role is "SuperAdmin"
          if (req.user.role === "SuperAdmin") {
            next();
          } else {
            // Role is not "SuperAdmin," deny access
            res.status(403).json({
              status: false,
              message: "Access denied. SuperAdmin role required.",
              error: "Access denied. SuperAdmin role required.",
            });
          }
        }
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Token is missing",
        error: "Token is missing",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error?.message ? error?.message : "Authentication failed",
      error: `Authentication failed | ${error?.message}`,
    });
  }
};

module.exports = {
  tokenVerification,
};
