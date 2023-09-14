module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Properties', 'squareFeet', {
        type: Sequelize.INTEGER,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'swimmingPool', {
        type: Sequelize.BOOLEAN,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'buildingAge', {
        type: Sequelize.INTEGER,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'plotArea', {
        type: Sequelize.INTEGER,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'furniture', {
        type: Sequelize.BOOLEAN,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'buildingType', {
        type: Sequelize.STRING,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'distanceToLarnaca', {
        type: Sequelize.INTEGER,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'distanceToErcan', {
        type: Sequelize.INTEGER,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'market', {
        type: Sequelize.STRING,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'hospital', {
        type: Sequelize.STRING,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'features', {
        type: Sequelize.TEXT,
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'area', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'type', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'hasPool', {
        transaction,
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Properties', 'hasPool', {
        type: Sequelize.BOOLEAN,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'area', {
        type: Sequelize.INTEGER,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'type', {
        type: Sequelize.STRING,
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'squareFeet', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'buildingAge', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'plotArea', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'furniture', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'buildingType', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'distanceToLarnaca', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'distanceToErcan', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'market', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'hospital', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'swimmingPool', {
        transaction,
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
