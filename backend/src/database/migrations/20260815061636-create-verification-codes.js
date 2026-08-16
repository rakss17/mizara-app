'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Verification_Codes', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
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

            code_hash: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            expires_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            attempts: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },

            used_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Verification_Codes');
    },
};
