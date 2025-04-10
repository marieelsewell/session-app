const express = require('express');
const { Session, User } = require('../models');

const router = express.Router();

// create session
router.post("/", async (req, res) => {
    try {
        const {user_id, name} = req.body;
        const session = await Session.create({ user_id, name });
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// delete session
router.delete("/:id", async (req, res) => {
    try {
        const sessionId = req.params.id;

        // find the session
        const session = await Session.findByPk(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // delete the session
        await session.destroy();

        res.json({ message: 'Session deleted successfully '});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// get session by session id
router.get("/:id", async (req, res) => {
    try {
        const sessionId = req.params.id;

        // find the session
        const session = await Session.findByPk(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.json(session);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// get sessions by user id
router.get("/", async (req, res) => {
    try {
        const userId = req.query.user_id; 

        // check if user_id is provided
        if (!userId) {
            return res.status(400).json({ message: 'User id is required' });
        }

        // check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // find the sessions
        const sessions = await Session.findAll({ where: { user_id: userId } });

        if (!sessions) {
            return res.status(404).json({ message: 'Sessions not found' });
        }

        res.json(sessions);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// update session
router.put("/:id", async (req, res) => {
    try {
        const sessionId = req.params.id;
        const {name} = req.body;

        // find the session
        const session = await Session.findByPk(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // update the session
        session.name = name;
        await session.save();

        res.json(session);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router;