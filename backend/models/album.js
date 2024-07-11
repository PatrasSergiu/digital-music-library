const { sequelize, Sequelize } = require('../config/database');
const Artist = require('./artist');

const Album = sequelize.define('album', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT }
});

Album.belongsTo(Artist, { foreignKey: 'artistId', onDelete: 'CASCADE'  });
Artist.hasMany(Album, { foreignKey: 'artistId' });

module.exports = Album;