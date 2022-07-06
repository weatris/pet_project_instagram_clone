const {DataTypes }  = require('sequelize');

module.exports = (sequelize)=>{

    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique:true
        },
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        firstname: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.STRING
        },
        tries: {
            type: DataTypes.INTEGER
        },
    }, {
        tableName: 'Users',
        timestamps: false
    });
}