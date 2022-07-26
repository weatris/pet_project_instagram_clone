const {DataTypes }  = require('sequelize');

module.exports = (sequelize)=>{
    return sequelize.define('comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique:true
        },
        content: {
            type: DataTypes.STRING
        },
        creation_time:{
            type:DataTypes.DATE
        }
    }, {
        tableName: 'Comment',
        timestamps: false
    });
}