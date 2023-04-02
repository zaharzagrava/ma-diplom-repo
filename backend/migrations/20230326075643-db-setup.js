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

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        updatedAt: {
          allowNull: false,
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

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        updatedAt: {
          allowNull: false,
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

    // Product
    await queryInterface.createTable(
      'Product',
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

        price: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },

        amount: {
          type: Sequelize.FLOAT,
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
      },
      {
        timestamps: true,
        transaction,
      },
    );

    // Equipment
    await queryInterface.createTable(
      'Equipment',
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

        price: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },

        amount: {
          type: Sequelize.FLOAT,
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
      },
      {
        timestamps: true,
        transaction,
      },
    );

    // Resource
    await queryInterface.createTable(
      'Resource',
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

        price: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },

        amount: {
          type: Sequelize.FLOAT,
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
      },
      {
        timestamps: true,
        transaction,
      },
    );

    // Credit
    await queryInterface.createTable(
      'Credit',
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

        sum: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },

        rate: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },

        startPeriod: {
          type: Sequelize.INTEGER,
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
      },
      {
        timestamps: true,
        transaction,
      },
    );

    await queryInterface.createTable(
      'Period',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        period: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        closedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        timestamps: true,
        transaction,
      },
    );

    // BisFunction
    await queryInterface.createTable(
      'BisFunction',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        type: {
          type: Sequelize.ENUM(
            'PAYOUT_CREDIT_FIXED_AMOUNT',
            'BUY_RESOURCE_PRODUCT_FIXED_AMOUNT',
          ),
          allowNull: false,
        },

        meta: {
          type: Sequelize.JSON,
          allowNull: false,
        },

        productId: {
          type: Sequelize.UUID,
          allowNull: true,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'Product',
            key: 'id',
          },
        },

        resourceId: {
          type: Sequelize.UUID,
          allowNull: true,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'Resource',
            key: 'id',
          },
        },

        creditId: {
          type: Sequelize.UUID,
          allowNull: true,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'Credit',
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
      },
      {
        timestamps: true,
        transaction,
      },
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
