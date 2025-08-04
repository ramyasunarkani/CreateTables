const { DataTypes } = require('sequelize');
const sequelize = require('../util/db-connection');

const createDynamicModel = (tableName, fieldsArray) => {
    const fieldsObj = {};

    fieldsArray.forEach(field => {
        let dataType;
        switch (field.type.toUpperCase()) {
            case 'STRING':
                dataType = DataTypes.STRING;
                break;
            case 'INTEGER':
                dataType = DataTypes.INTEGER;
                break;
            case 'BOOLEAN':
                dataType = DataTypes.BOOLEAN;
                break;
            case 'DATE':
                dataType = DataTypes.DATE;
                break;
            default:
                dataType = DataTypes.STRING;
        }
        fieldsObj[field.name] = { type: dataType };
    });

   return sequelize.define(tableName, fieldsObj, {
    freezeTableName: true,
    timestamps: false
});

};

module.exports = createDynamicModel;
