const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // const cookies = req.cookies;
    // console.log(cookies)
  const authtoken = req.cookies.token

  if (authtoken) {
    jwt.verify(authtoken, 'secret', (err, decodedToken) => {
        if(err) {
            console.log(err.message);
            res.status(200).redirect('/login')
        }else{
            console.log(decodedToken)
            next();
        }
    })
  }
  else{
     res.redirect('/login')
  }
};

module.exports = verifyToken;