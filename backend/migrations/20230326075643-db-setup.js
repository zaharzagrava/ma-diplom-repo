'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    );

    const transaction = await queryInterface.sequelize.transaction();

    // User
    await queryInterface.createTable(
      'User',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        email: {
          type: Sequelize.STRING(255),
          unique: true,
          allowNull: false,
        },

        fullName: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },

        country: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },

        city: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      },
      {
        timestamps: true,
        transaction,
      },
    );

    // Department
    await queryInterface.createTable(
      'Department',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        name: {
          type: Sequelize.STRING(255),
          unique: true,
          allowNull: false,
        },

        parentId: {
          type: Sequelize.UUID,
          allowNull: true,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'Department',
            key: 'id',
          },
        },

        managerId: {
          type: Sequelize.UUID,
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'User',
            key: 'id',
          },
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      },
      {
        timestamps: true,
        transaction,
      },
    );

    await queryInterface.addColumn(
      'User',
      'departmentId',
      {
        type: Sequelize.UUID,
        allowNull: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
          model: 'Department',
          key: 'id',
        },
      },
      { transaction },
    );

    await transaction.commit();
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;    
    `);
  },
};
