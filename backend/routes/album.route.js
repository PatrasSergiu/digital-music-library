const express = require('express');
const { findAllAlbums, findAllSongsByAlbum, createAlbum, findAlbumById, updateAlbum, deleteAlbum } = require('../controllers/album.controller');

const router = express.Router();

router.get('/', findAllAlbums);
router.get('/:albumId', findAlbumById);
router.get('/:albumId/songs', findAllSongsByAlbum);
router.post('/', createAlbum);
router.put('/:albumId', updateAlbum);
router.delete('/:albumId', deleteAlbum)

module.exports = router;