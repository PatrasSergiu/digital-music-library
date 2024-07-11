const { sequelize, Sequelize } = require('../config/database');

const Artist = sequelize.define('artist', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false }
});

module.exports = Artist;