const express = require('express');
const fs = require('fs');
const path = require('path');
const { ChordProgression } = require('../models'); 
const router = express.Router();
const { User } = require('../models');

const getUserIdByFirebaseUid = async (userID) => {
    try {
        const user = await User.findOne({ where: { userID: userID } });
        if (!user) {
            throw new Error('User not found');
        }
        return user.id;
    } catch (error) {
        throw error;
    }
};

// Create a new chord progression
router.post('/', async (req, res) => {
    console.log('Request body:', req.body);
    try {
        const user_id = await getUserIdByFirebaseUid(req.body.user_id);
        console.log('User ID:', user_id);
        const { title, chords, key, tempo, rhythm, scaleType } = req.body;
        const progression = await ChordProgression.create({
            user_id,
            title,
            chords: JSON.stringify(chords),
            key,
            tempo,
            rhythm,
            scaleType,
        });
        res.status(201).json(progression);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a chord progression by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const progression = await ChordProgression.findByPk(id);
        if (!progression) {
            return res.status(404).json({ error: 'Chord progression not found' });
        }
        res.json(progression);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all chord progressions for a user by user ID
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const progressions = await ChordProgression.findAll({ where: { user_id: userId } });
        res.json(progressions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a chord progression by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await ChordProgression.destroy({ where: { id } });
        if (!deleted) {
            return res.status(404).json({ error: 'Chord progression not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a chord progression by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, chords, key, tempo, rhythm, scaleType } = req.body;
    try {
        const progression = await ChordProgression.findByPk(id);
        if (!progression) {
            return res.status(404).json({ error: 'Chord progression not found' });
        }
        progression.title = title || progression.title;
        progression.chords = chords ? JSON.stringify(chords) : progression.chords;
        progression.key = key || progression.key;
        progression.tempo = tempo || progression.tempo;
        progression.rhythm = rhythm || progression.rhythm;
        progression.scaleType = scaleType || progression.scaleType;
        await progression.save();
        res.json(progression);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;