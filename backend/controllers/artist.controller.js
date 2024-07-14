const Artist = require('../models/artist');
const Album = require('../models/album');

const findAllArtists = async (req, res) => {
    try {
        const artists = await Artist.findAll();
        res.json(artists);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const findAllAlbumsByArtist = async (req, res) => {
    try {
        const artistId = req.params.artistId;
        const albums = await Album.findAll({
            where: { artistId: artistId }
        });
        if(albums.length > 0) {
            res.json(albums);
        } else {
            res.status(404).send('No albums found for the specified artist.');
        }
    } catch (error) {
        res.status(500).send(`Error retrieving albums: ${error.message}`);
    }
};

const createArtist = async (req, res) => {
    try {
        const newArtist = await Artist.create(req.body);
        res.status(201).json(newArtist);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

const findArtistById = async (req, res) => {
    try {
        const artist = await Artist.findByPk(req.params.artistId);
        if (!artist) {
            return res.status(404).send('Artist not found');
        }
        res.json(artist);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateArtist = async (req, res) => {
    try {
        const { id } = req.params.artistId;
        const [updated] = await Artist.update(req.body, {
            where: { id: id }
        });
        if (!updated) {
            return res.status(404).json({ message: "Artist not found." });
        }
        const updatedArtist = await Artist.findByPk(id);
        res.status(200).json(updatedArtist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteArtist = async (req, res) => {
    try {
        const { id } = req.params.artistId;
        const deleted = await Artist.destroy({
            where: { id: id }
        });
        if (!deleted) {
            return res.status(404).json({ message: "Artist not found" });
        }
        res.status(200).json({ message: "Artist deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    findAllArtists,
    findAllAlbumsByArtist,
    findArtistById,
    createArtist,
    updateArtist,
    deleteArtist
}