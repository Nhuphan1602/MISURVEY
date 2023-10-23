const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Module = db.sequelize.define('Module', {
  ModuleID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ModuleName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  ModuleDescription: {
    type: DataTypes.TEXT
  },
  CreatedAt: {
    type: DataTypes.DATE
  },
  CreatedBy: {
    type: DataTypes.INTEGER
  },
  UpdatedAt: {
    type: DataTypes.DATE
  },
  UpdatedBy: {
    type: DataTypes.INTEGER
  }
}, {
    tableName: 'Modules',
    timestamps: false,
});

module.exports = Module;

