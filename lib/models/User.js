const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: [true, 'Email is taken']
  },
  passwordHash: {
    type: String,
    required: true
  }
},
{
  // removes passwordHash from any mongoose queries on the return
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
    }
  }
});

// hash new user's password and store as passwordHash
schema.virtual('password').set(function(password){
  this.passwordHash = bcrypt.hashSync(password, 10);
});

// if tokenPayload contains a valide email, hydrate appends all methods, statics, and virtuals to it
schema.statics.findByToken = function(token){
  try {
    const tokenPayload = jwt.verify(token, process.env.APP_SECRET);
    return Promise.resolve(this.hydrate({
      _id: tokenPayload._id,
      email: tokenPayload.email,
      __v: tokenPayload.__v
    }));
  }
  catch(err){
    return Promise.reject(err);
  }
};

schema.statics.authenticate = async function({ email, password }) {
  const user = await this.findOne({ email });
  if(!user){
    const err = new Error('Invalid email/password');
    err.status = 401;
    throw err;
  }
  const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
  if(!isValidPassword){
    const err = new Error('Invalid email/password');
    err.status = 401;
    throw err;
  }
  return user;
};

schema.methods.generateAuthToken = function() {
  return jwt.sign(this.toJSON(), process.env.APP_SECRET, {
    expiresIn: '24h'
  });
};

schema.virtual('fractals', {
  ref: 'Fractal',
  localField: '_fractalId',
  foreignField: 'contributingUserId'
});

module.exports = mongoose.model('User', schema);
