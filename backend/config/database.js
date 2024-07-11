const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE, 
    process.env.MYSQL_USER, 
    process.env.MYSQL_PASSWORD, 
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        pool: {
            max: 5,        
            min: 0,        
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = { sequelize, Sequelize };