const {DataTypes }  = require('sequelize');

module.exports = (sequelize)=>{
    return sequelize.define('media', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique:true
        },
        path: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        index: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        creation_time:{
            type:DataTypes.DATE
        }
    }, {
        tableName: 'Media',
        timestamps: false
    });
}