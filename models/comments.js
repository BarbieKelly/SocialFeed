'use strict';
module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define('comments', {
    comment: DataTypes.STRING,
    post_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {});
  comments.associate = function(models) {
    // associations can be defined here
  };
  return comments;
};