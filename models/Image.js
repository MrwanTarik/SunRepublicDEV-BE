module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} Image
   * @property {string} id
   * @property {string} propertyId.required
   * @property {string} path.required
   * @property {string} createdAt - ISO Date
   * @property {string} updatedAt - ISO Date
   */
  const Image = sequelize.define(
    'Image',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
      propertyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  Image.associate = function(models) {
    Image.belongsTo(models.Property, {
      foreignKey: 'propertyId',
    });
  };
  return Image;
};
