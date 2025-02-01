const express = require('express');
const { User } = require('../models');

const router = express.Router();

// create user
router.post("/", async (req, res) => {
    try {
        const {username, email, password_hash} = req.body;
        const user = await User.create({ username, email, password_hash });
        res.status(201).json(lyrics);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router;