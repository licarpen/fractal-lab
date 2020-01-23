const Fractal = require('./Fractal');

describe('Fractal model', () => {
  it('has required name', () => {
    const fractal = new Fractal();
    const { errors } = fractal.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });
  it('has require contributingUser', () => {
    const fractal = new Fractal();
    const { errors } = fractal.validateSync();
    expect(errors.contributingUser.message).toEqual('Path `contributingUser` is required.');
  });
  it('has required description', () => {
    const fractal = new Fractal();
    const { errors } = fractal.validateSync();
    expect(errors.description.message).toEqual('Path `description` is required.');
  });
  it('has required generatingCode', () => {
    const fractal = new Fractal();
    const { errors } = fractal.validateSync();
    expect(errors.generatingCode.message).toEqual('Path `generatingCode` is required.');
  });
});
