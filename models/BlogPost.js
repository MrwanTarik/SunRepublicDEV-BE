module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} BlogPost
   * @property {string} id
   * @property {string} title
   * @property {string} titleRus
   * @property {string} textContent
   * @property {string} textContentRus
   * @property {string} imagePath
   * @property {string} createdAt - ISO Date
   * @property {string} updatedAt - ISO Date
   */
  const BlogPost = sequelize.define(
    'BlogPost',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      titleRus: DataTypes.STRING,
      textContent: DataTypes.TEXT,
      textContentRus: DataTypes.TEXT,
      imagePath: DataTypes.STRING,
      readCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {}
  );
  BlogPost.associate = function() {
    // associations can be defined here
  };
  return BlogPost;
};
