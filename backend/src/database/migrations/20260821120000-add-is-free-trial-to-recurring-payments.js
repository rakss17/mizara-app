'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'Recurring_Payments',
            'is_free_trial',
            {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        );
    },

    async down(queryInterface) {
        await queryInterface.removeColumn(
            'Recurring_Payments',
            'is_free_trial',
        );
    },
};
