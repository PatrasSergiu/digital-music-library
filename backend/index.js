const express = require('express');
const mongoose = require('mongoose');
const { sequelize } = require('./config/database');
const fs = require('fs');
const path = require('path');

const artistRoutes = require('./routes/artist.route');
const albumRoutes = require('./routes/album.route');
const songRoutes = require('./routes/song.route');

const Artist = require('./models/artist');
const Album = require('./models/album');
const Song = require('./models/song');

const app = express();
app.use(express.json());
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/songs', songRoutes);

app.get('/', (req, res) => {
    res.send("Hello from Node API dev");
});

const PORT = process.env.PORT || 3000;

//during development we used force: true to drop the schemas and create new ones each time the server is restarted
//once we are done with testing we remove force: true and comment the importData function after running it once, to prevent duplicate data.
sequelize.sync({ force: true })
    .then(async () => {
        console.log("Database synced");
        await importData();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(error => {
        console.error('Unable to sync database:', error);
    });

const importData = async () => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

    for (const artistData of data) {
        const artist = await Artist.create({ name: artistData.name });

        for (const albumData of artistData.albums) {
            const album = await Album.create({
                title: albumData.title,
                description: albumData.description,
                artistId: artist.id
            });

            for (const songData of albumData.songs) {
                await Song.create({
                    title: songData.title,
                    length: songData.length,
                    albumId: album.id
                });
            }
        }
    }
};