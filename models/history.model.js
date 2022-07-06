const {DataTypes }  = require('sequelize');

module.exports = (sequelize)=>{

    return sequelize.define('history', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique:true
        },
        watched_time:{
            type:DataTypes.DATE
        }
    }, {
        tableName: 'History',
        timestamps: false
    });
}