const express = require('express');
const { Lyric } = require('../models');
const { User } = require('../models');

const router = express.Router();

const getUserIdByFirebaseUid = async (userID) => {
    try {
        const user = await User.findOne({ where: { userID: userID } });
        console.log("Found user:", user);
        if (!user) {
            throw new Error('User not found');
        }
        console.log("User ID for lyric creation:", user.id);
        return user.id;
    } catch (error) {
        throw error;
    }
};

// create lyrics
router.post("/", async (req, res) => {
    console.log("Request body of new lyric:", req.body);
    try {
        const user_id = await getUserIdByFirebaseUid(req.body.userId); 
        console.log("User ID converted to:", user_id);
        const { title, content } = req.body; 
        const lyric = await Lyric.create({ user_id, title, content }); 
        res.status(201).json(lyric);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get all lyrics for a user
router.get("/user/:user_id", async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const lyrics = await Lyric.findAll({ where: { user_id } });
        res.status(200).json(lyrics);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// get a lyric by id
router.get("/:lyric_id", async (req, res) => {
    try {
        const lyric_id = req.params.lyric_id;
        const lyric = await Lyric.findByPk(lyric_id);
        if (lyric) {
            res.status(200).json(lyric);
        } else {
            res.status(404).json({ message: "Lyric not found" });
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// update a lyric 
router.put("/:lyric_id", async (req, res) => {
    try {
        const lyric_id = req.params.lyric_id;
        const { title, content } = req.body;
        const lyric = await Lyric.findByPk(lyric_id);
        if (lyric) {
            lyric.title = title;
            lyric.content = content;
            await lyric.save();
            res.status(200).json(lyric);
        } else {
            res.status(404).json({ message: "Lyric not found" });
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// delete a lyric
router.delete("/:lyric_id", async (req, res) => {
    try {
        const lyric_id = req.params.lyric_id;
        const lyric = await Lyric.destroy({ where: { id: lyric_id } });
        if (lyric) {
            res.status(200).json({ message: "Lyric deleted successfully" });
        } else {
            res.status(404).json({ message: "Lyric not found" });
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router;