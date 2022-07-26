const {DataTypes }  = require('sequelize');

module.exports = (sequelize)=>{
    return sequelize.define('notification', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique:true
        }
    }, {
        tableName: 'Notification',
        timestamps: false
    });
}