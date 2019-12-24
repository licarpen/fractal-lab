require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Fractal = require('../lib/models/Fractal');
const User = require('../lib/models/User');


describe('app fractal routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let treeFractal;
  let user;

  beforeEach(async() => {
    user = await User
      .create({
        email: 'me@me.com',
        password: '123',
        role: 'user'
      });
    treeFractal = await Fractal
      .create({
        name: 'tree',
        contributingUser: user._id,
        description: 'n iterations of a tree fractal with each branch diverging to two branchs apart by r radians and 2/3 length of previous branch.',
        generatingCode: 'generateTreeFractal'
      });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a fractal', () => {
    return request(app)
      .post('/api/v1/fractals')
      .send({
        name: 'koch snowflake',
        description: 'snowflake pattern',
        generatingCode: 'generateKochSnowflakeFractal',
        contributingUser: user._id
      })
      .then(res => expect(res.body).toEqual({
        _id: expect.any(String),
        __v: 0,
        name: 'koch snowflake',
        description: 'snowflake pattern',
        generatingCode: 'generateKochSnowflakeFractal',
        contributingUser: user._id.toString()
      }));
  });

  it('gets all fractals', async() => {
    const fractals = await Fractal.create([
      {
        name: 'tree',
        contributingUser: user._id,
        description: 'n iterations of a tree fractal with each branch diverging to two branchs apart by r radians and 2/3 length of previous branch.',
        generatingCode: 'generateTreeFractal'
      }, 
      {
        name: 'koch snowflake',
        description: 'snowflake pattern',
        generatingCode: 'generateKochSnowflakeFractal',
        contributingUser: user._id
      }
    ]);
    return request(app)
      .get('/api/v1/fractals')
      .then(res => {
        fractals.forEach(fractal => {
          expect(res.body).toContainEqual(JSON.parse(JSON.stringify(fractal)));
        });
      });
  });

  it('gets a fractal by id', () => {
    return request (app)
      .get(`/api/v1/fractals/${treeFractal._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'tree',
          contributingUser: JSON.parse(JSON.stringify(user)),
          description: 'n iterations of a tree fractal with each branch diverging to two branchs apart by r radians and 2/3 length of previous branch.',
          generatingCode: 'generateTreeFractal',
          _id: treeFractal.id,
          __v: 0
        });
      });
  });

  it('updates a fractal by id', () => {
    return request (app)
      .patch(`/api/v1/fractals/${treeFractal._id}`)
      .send({ name: 'symmetrical tree' })
      .then(res => {
        expect(res.body).toEqual({
          name: 'symmetrical tree',
          contributingUser: user.id,
          description: 'n iterations of a tree fractal with each branch diverging to two branchs apart by r radians and 2/3 length of previous branch.',
          generatingCode: 'generateTreeFractal',
          _id: treeFractal.id,
          __v: 0
        });
      });
  });

  it('delete a fractal by id', () => {
    return request (app)
      .delete(`/api/v1/fractals/${treeFractal._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: 'tree',
          contributingUser: user.id,
          description: 'n iterations of a tree fractal with each branch diverging to two branchs apart by r radians and 2/3 length of previous branch.',
          generatingCode: 'generateTreeFractal',
          _id: treeFractal.id,
          __v: 0
        });
      });
  });
});
