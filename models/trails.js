'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.trails.belongsTo(models.users)
    }
  };
  trails.init({
    summary: DataTypes.TEXT,
    difficulty: DataTypes.TEXT,
    stars: DataTypes.FLOAT,
    location: DataTypes.TEXT,
    length: DataTypes.FLOAT,
    high: DataTypes.INTEGER,
    low: DataTypes.INTEGER,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    ascent: DataTypes.INTEGER,
    descent: DataTypes.INTEGER,
    conditionStatus: DataTypes.TEXT,
    conditionDate: DataTypes.STRING,
    url: DataTypes.TEXT,
    image: DataTypes.TEXT,
    name: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'trails',
  });
  return trails;
};