const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    User
        .find()
        .then(users => {
            res.status(200).json(users);
        });
});

router.get('/:id', (req, res) => {
    var id = req.params.id;
    User
        .findById(id)
        .then(users =>  (users ? (res.status(200).json(users)) : res.status(404).send()))
        .catch(err => res.status(404).send('An internal server error has occured'));
});

router.post('/', (req, res) => {
    const user = new User(req.body);
    user
        .save()
        .then(user => {
            res.status(201).json(user);
        });
});

router.put("/:id", (req, res) => {
    User
        .findByIdAndUpdate(req.params.id,req.body)
        .then(user => {
            if (!user) res.status(404).send();
            res.status(204).json(user);
        })
        .catch(err => res.status(404).send("User not found"));
});

router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    User
      .findByIdAndRemove(userId, (err, deletedUser) => {
        if (deletedUser) {
          res.status(200).json(deletedUser);
        } else {
          res.status(404).send(`User not found`);
        }
      });
  });

module.exports = router;


