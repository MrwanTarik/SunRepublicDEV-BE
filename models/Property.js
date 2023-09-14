module.exports = (sequelize, DataTypes) => {
  /**
   * @typedef {object} Property
   * @property {string} id
   * @property {string} title.required
   * @property {string} action.required
   * @property {number} price.required
   * @property {string} description.required
   * @property {string} titleRus
   * @property {string} ppid
   * @property {string} descriptionRus
   * @property {number} bedrooms
   * @property {number} squareFeet
   * @property {number} buildingAge
   * @property {number} bathrooms
   * @property {number} plotArea
   * @property {boolean} swimmingPool
   * @property {boolean} furniture
   * @property {string} buildingType.required
   * @property {string} region.required
   * @property {number} floorCount
   * @property {string} distanceToLarnaca
   * @property {string} distanceToErcan
   * @property {string} market
   * @property {string} hospital
   * @property {string} features
   * @property {boolean} hasHOAFee
   * @property {string} createdAt - ISO Date
   * @property {string} updatedAt - ISO Date
   */
  const Property = sequelize.define(
    'Property',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      titleTurkey: DataTypes.STRING,
      titleRus: DataTypes.STRING,
      ppid: DataTypes.STRING,
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      descriptionTurkey: DataTypes.TEXT,
      descriptionRus: DataTypes.TEXT,
      bedrooms: DataTypes.INTEGER,
      squareFeet: DataTypes.INTEGER,
      buildingAge: DataTypes.INTEGER,
      bathrooms: DataTypes.INTEGER,
      plotArea: DataTypes.INTEGER,
      swimmingPool: DataTypes.BOOLEAN,
      furniture: DataTypes.BOOLEAN,
      buildingType: DataTypes.STRING,
      region: DataTypes.STRING,
      floorCount: DataTypes.INTEGER,
      distanceToLarnaca: DataTypes.INTEGER,
      distanceToErcan: DataTypes.INTEGER,
      market: DataTypes.STRING,
      hospital: DataTypes.STRING,
      hasHOAFee: DataTypes.BOOLEAN,
      action: DataTypes.STRING,
      price: DataTypes.INTEGER,
      features: DataTypes.TEXT,
    },
    {}
  );
  Property.associate = function (models) {
    Property.hasMany(models.Image, {
      foreignKey: 'propertyId',
    });
  };
  return Property;
};
