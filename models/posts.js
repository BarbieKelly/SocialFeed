'use strict';
module.exports = (sequelize, DataTypes) => {
  const posts = sequelize.define('posts', {
    date: DataTypes.STRING,
    body: DataTypes.STRING,
    imageurl: DataTypes.STRING,
    color: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {});
  posts.associate = function(models) {
    // associations can be defined here
  };
  return posts;
};