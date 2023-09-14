module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Properties', 'titleTurkey', {
        type: Sequelize.STRING,
        transaction,
      });
      await queryInterface.addColumn('Properties', 'descriptionTurkey', {
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
      await queryInterface.removeColumn('Properties', 'titleTurkey', {
        transaction,
      });
      await queryInterface.removeColumn('Properties', 'descriptionTurkey', {
        transaction,
      });

      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

