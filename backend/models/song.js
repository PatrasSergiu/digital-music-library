const { sequelize, Sequelize } = require('../config/database');
const Album = require('./album');

const Song = sequelize.define('song', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: Sequelize.STRING, allowNull: false },
    length: { type: Sequelize.STRING }
});

Song.belongsTo(Album, { foreignKey: 'albumId',  onDelete: 'CASCADE' });
Album.hasMany(Song, { foreignKey: 'albumId'});

module.exports = Song;
