const Album = require('../models/album');

const findAllAlbums = async (req, res) => {
    try {
        const albums = await Album.findAll({
            include: [{
                model: require('../models/artist'),
                as: 'artist'
            }]
        });
        res.json(albums);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createAlbum = async (req, res) => {
    try {
        const newAlbum = await Album.create(req.body);
        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const findAlbumById = async (req, res) => {
    try {
        const album = await Album.findByPk(req.params.id, {
            include: ['artist']
        });
        if (!album) {
            return res.status(404).send('Album not found');
        }
        res.json(album);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Album.update(req.body, {
            where: { id: id }
        });
        if (!updated) {
            return res.status(404).json({ message: "Album not found." });
        }
        const updatedAlbum = await Album.findByPk(id);
        res.status(200).json(updatedAlbum);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAlbum = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Album.destroy({
            where: { id: id }
        });
        if (!deleted) {
            return res.status(404).json({ message: "Album not found" });
        }
        res.status(200).json({ message: "Album deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    findAllAlbums,
    findAlbumById,
    createAlbum,
    updateAlbum,
    deleteAlbum
};
