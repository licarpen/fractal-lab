require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app authentication routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('signs up a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'me@me.com', password: '123', role: 'user' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({ 
          _id: expect.any(String),
          email: 'me@me.com',
          __v: 0,
          role: 'user'
        });
      });
  });
  /* Find out why this fails - creating a user with email then trying to sign up new user with same email... getting response back.  
  it('rejects to sign up a user when email is already in use', async() => {
    await User.create({ email: 'me@me.com', password: '123' });
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'me@me.com', password: '123' })
      .then(res => {
        expect(res.body).toEqual({ message: 'email already in use' });
      });
  });
*/
  it('receives error message when login lacks valid email', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'me', password: '123', role: 'user' })
      .then(res => {
        expect(res.body).toEqual({ message: 'Invalid email/password', status: 401 });
      });
  });

  it('receives error message when login lacks valid password', async() => {
    await User.create({ email: 'me@me.com', password: '123', role: 'user' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'me@me.com', password: '12' })
      .then(res => {
        expect(res.body).toEqual({ message: 'Invalid email/password', status: 401 });
      });
  });
});


