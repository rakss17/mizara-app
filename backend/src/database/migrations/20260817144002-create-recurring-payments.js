'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Recurring_Payments', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },

            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
            },

            currency: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'PHP',
            },

            billing_cycle: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            is_auto_renew: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            is_archived: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            icon: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            due_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Recurring_Payments');
    },
};
