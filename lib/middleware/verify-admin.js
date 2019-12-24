const User = require('../models/User');

module.exports = (req, res, next) => {
  const token = req.cookies.session;
  User
    .findByToken(token)
    .then(user => {
      if(user.role === 'admin'){
        next();
      }
    })
    .catch(next);
};
