'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Missing Title!"
        }
      }
    },
    description:{
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Missing Description!"
        }
      }
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
    }
  });

// "Course" belongs to a single "User"
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: 'userId',
     // as: 'User',
     // foreignKey: {
     //   fieldName: "userId",
     //   allowNull: false
    });
  };
  return Course;
};
