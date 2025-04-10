const express = require('express');
const fs = require('fs');
const path = require('path');
const { Recording } = require('../models'); // Sequelize model
const upload = require('../middleware/multerConfig'); // Multer config
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

//upload audio file
router.post('/upload', upload.single('file_path'), async (req, res) => {
    try {
        const user_id = await getUserIdByFirebaseUid(req.body.userId); 
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!req.body.userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const { file_path, duration, title } = req.body;
        const filePath = `/uploads/audio/${req.file.filename}`; 
        console.log("FILE PATH", filePath);

        const newRecording = await Recording.create({
            user_id,
            file_path: filePath,  
            duration,
            title
        });
        res.status(200).json({ message: 'Recording uploaded!', recording: newRecording });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed', details: error.message });
    }
});

//retrieve recording by id
router.get('/:id', async (req, res) => {
    try {
        const recording = await Recording.findByPk(req.params.id);
        if (!recording) return res.status(404).json({ error: 'Recording not found' });

        res.json(recording);
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

// retrieve all recordings for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const recordings = await Recording.findAll({ where: { user_id: req.params.userId } });
        res.json(recordings);
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

// retrieve all recordings for a session
router.get('/session/:sessionId', async (req, res) => {
    try {
        const recordings = await Recording.findAll({ where: { session_id: req.params.sessionId } });
        res.json(recordings);
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

// delete recording by id
router.delete('/:id', async (req, res) => {
    try {
        const recording = await Recording.findByPk(req.params.id);
        if (!recording) return res.status(404).json({ error: 'Recording not found' });


        // Delete the file from the server
        const filePath = path.join(__dirname, '..', recording.file_path);
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({ error: 'Error deleting file', details: err.message });
                }
            });
        } else {
            console.warn('File not found:', filePath);
        }

        await recording.destroy();
        res.json({ message: 'Recording deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
});

module.exports = router;