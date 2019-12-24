const { Router } = require('express');
const Fractal = require('../models/Fractal');
const verifyAdmin = require('../middleware/verify-admin');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', verifyAdmin, (req, res) => {
    Fractal
      .create(req.body)
      .then(fractal => res.send(fractal));
  })

  .get('/', ensureAuth, (req, res) => {
    Fractal
      .find()
      .then(fractals => res.send(fractals));
  })

  .get('/:id', ensureAuth, (req, res) => {
    Fractal
      .findById(req.params.id)
      .populate('contributingUser')
      .then(fractal => res.send(fractal));
  })

  .patch('/:id', verifyAdmin, (req, res) => {
    Fractal 
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(fractal => res.send(fractal));
  })

  .delete('/:id', verifyAdmin, (req, res) => {
    Fractal
      .findOneAndDelete(req.params.id)
      .then(fractal => res.send(fractal));
  });
