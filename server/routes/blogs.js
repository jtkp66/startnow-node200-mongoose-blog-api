const express = require('express');
const router = express.Router();
const Blogs = require("../models/Blog");
const User = require("../models/User");

router.get("/", (req, res) => {
    Blogs.find()
        .then(blogs => {
            res.status(200).json(blogs);
        });
});

router.get("/featured", (req, res) => {
    Blogs.where({ blogs: "featured" })
        .then(blogs => {
            res.status(200).json(blogs);
        })
        .catch(e => res.status(500).send("An internal server error has occured"));
});

router.get('/:id', (req, res) => {
    var userId = req.params.id;
    Blogs
        .findById(userId)
        .then(blogs => (blogs ? (res.status(200).json(blogs)) : res.status(404).send()))
        .catch(err => res.status(500).send('An internal server error has occured'));
});

router.post('/', (req, res) => {
    let dbUser = null;
    User
        .findById(req.body.authorId)
        .then(user => {
            dbUser = user;
            const newBlog = new Blogs(req.body);
            newBlog.author = user._id;
            return newBlog.save();
        })
        .then(blog => {
            dbUser.blogs.push(blog);
            dbUser.save().then(() => res.status(201).json(blog));
        })
});

router.put("/:id", (req, res) => {
    Blogs.findByIdAndUpdate(req.params.id, { $set: req.body })
        .then(blogs => {
            res.status(204).json(blogs);
        })
        .catch(e => res.status(500).send("Error"));
});

router.delete("/:id", (req, res) => {
    let id = req.params.id;
    Blogs.findByIdAndRemove(id)
        .then(blogs => {
            res.status(200).json(blogs);
        })
        .catch(console.error);
});

module.exports = router;
