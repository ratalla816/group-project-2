
// completed by Rob on 9/21 @ 1540

// WHEN I choose to share an experience
// THEN I am able to post some text with a title to my page – MODEL: EXPERIENCE (ID TITLE TEXT) 

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


class Post extends Model {}

Post.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, references: { model: 'user', key: 'id' }},
    title: { type: DataTypes.STRING, allowNull: false },
    post_url: { type: DataTypes.STRING, allowNull: false, validate: { isURL: true }}
  },

  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'Experience'
  }
);

module.exports = Experience;