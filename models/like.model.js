const {DataTypes }  = require('sequelize');

module.exports = (sequelize)=>{

    return sequelize.define('like', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique:true
        },
        creation_time:{
            type:DataTypes.DATE
        }
    }, {
        tableName: 'Like',
        timestamps: false
    });
}