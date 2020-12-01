'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class savedTrails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.trails.belongsTo(models.users)
    }
  };
  savedTrails.init({
    user_id: DataTypes.INTEGER,
    trail_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'savedTrails',
  });
  return savedTrails;
};