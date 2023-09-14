module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Properties', 'titleRus', {
        type: Sequelize.STRING,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'descriptionRus', {
        type: Sequelize.TEXT,
        transaction,
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Properties', 'titleRus', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'descriptionRus', {
        transaction,
      });

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
