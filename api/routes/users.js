const express = require('express');

const router = express.Router();

const User = require('../models/user');


router.get('/:parkingId', (req, res) => {

});


router.post('/signup', (req, res) => {
  console.log(req.body);
  const user = {
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  };
  User
    .create(user)
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({
        messsage: err
      });
    });
});


router.post('/signin', (req, res) => {
  User.findOne({ email: req.body.email, password: req.body.password })
    .then(user => {
      if (!user) {
        res.status(401).json({
          message: 'Unauthorized'
        });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      res.status(401).json(err);
    });
});


module.exports = router;