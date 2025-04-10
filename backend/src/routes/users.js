const express = require('express');
const { User } = require('../models');

const router = express.Router();

// Create user
router.post("/", async (req, res) => {
    try {
        const { userId, email } = req.body;
        const user = await User.create({ userId, email });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user by ID
router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get user id given firebase uid
router.get("/auth/:userID", async (req, res) => {
    try {
        const userID = req.params.userID;
        const user = await User.findOne({ where: { userID: userID } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({id: user.id});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user
router.put("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const { email } = req.body;

        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.email = email || user.email;
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// TODO: Get user items (gets their sessions, lyrics, recordings, and chord progressions)
// fetch all the arrays and flatten them into one array
// add a type field into each object to identify what type of object it is
// sort by timestamp
// return the array

module.exports = router;