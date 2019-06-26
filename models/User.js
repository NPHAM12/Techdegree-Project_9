'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Missing Firstname!"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Missing Lastname!"
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Missing Email!"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Missing Password!"
        }
      }
    }
  });

// User" has many "Courses"
  User.associate = function(models) {
    User.hasMany(models.Course, {
      foreignKey: 'userId'
      // as: 'User',
      // foreignKey: {
      //   fieldName: "userId",
      //   allowNull: false
      // }
    });
  };
  return User;
};
