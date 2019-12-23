const mongoose = require('mongoose');
const User = require('./User');

describe('User model', () => {
  it('has a required email', () => {
    const user = new User();
    const { errors } = user.validateSync();
    expect(errors.email.message).toEqual('Path `email   is required.');
  });
});
