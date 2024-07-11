const express = require('express');
const { findAllAlbums, createAlbum, findAlbumById, updateAlbum, deleteAlbum } = require('../controllers/album.controller');

const router = express.Router();

router.get('/', findAllAlbums);
router.post('/', createAlbum);
router.get('/:id', findAlbumById);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum)

module.exports = router;