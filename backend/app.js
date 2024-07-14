const express = require('express');
const artistRoutes = require('./routes/artist.route');
const albumRoutes = require('./routes/album.route');
const songRoutes = require('./routes/song.route');

const app = express();

app.use(express.json());
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/songs', songRoutes);

module.exports = app;

