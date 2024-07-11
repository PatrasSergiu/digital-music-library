const Song = require('../models/song');
const Album = require('../models/album'); 

const findAllSongs = async (req, res) => {
    try {
        const songs = await Song.findAll({
            include: [Album]
        });
        res.json(songs);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createSong = async (req, res) => {
    try {
        const newSong = await Song.create(req.body);
        res.status(201).json(newSong);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const findSongById = async (req, res) => {
    try {
        const song = await Song.findByPk(req.params.id, {
            include: [Album]
        });
        if (!song) {
            return res.status(404).send('Song not found');
        }
        res.json(song);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateSong = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Song.update(req.body, {
            where: { id: id }
        });
        if (!updated) {
            return res.status(404).json({ message: "Song not found." });
        }
        const updatedSong = await Song.findByPk(id);
        res.status(200).json(updatedSong);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSong = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Song.destroy({
            where: { id: id }
        });
        if (!deleted) {
            return res.status(404).json({ message: "Song not found" });
        }
        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    findAllSongs,
    findSongById,
    createSong,
    updateSong,
    deleteSong
};
