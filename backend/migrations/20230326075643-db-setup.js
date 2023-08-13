'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    );

    const transaction = await queryInterface.sequelize.transaction();

    // Business
    await queryInterface.createTable(
      'Business',
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

        balance: {
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

        type: {
          type: Sequelize.ENUM('SEAMSTRESS', 'CUTTER', 'MANAGER'),
          allowNull: false,
        },

        salary: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        employedAt: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
          allowNull: true,
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

    // ProductionChain
    await queryInterface.createTable(
      'ProductionChain',
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

    // ProductionChainEquipment
    // Specifies which and how much equipment each user invlolved in creation of a given product (specified in ProductionChainUser) is needed
    // to create 1 of product
    await queryInterface.createTable(
      'ProductionChainEquipment',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        amount: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },

        equipmentId: {
          type: Sequelize.UUID,
          allowNull: true,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'Equipment',
            key: 'id',
          },
        },

        productionChainId: {
          type: Sequelize.UUID,
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'ProductionChain',
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

    // ProductionChainResource
    // Specifies how much of this resource is need to create 1 of product
    await queryInterface.createTable(
      'ProductionChainResource',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        amount: {
          type: Sequelize.FLOAT,
          allowNull: false,
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

        productionChainId: {
          type: Sequelize.UUID,
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'ProductionChain',
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

    // ProductionChainUser
    // Has two types of records
    //   - the ones with userId = null, they specify what kind of users are needed on this ProductionChain, those records are static, and should not be modified
    //   - the ones with userId, they specify what users are actually working on this ProductionChain
    await queryInterface.createTable(
      'ProductionChainUser',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          primaryKey: true,
        },

        type: {
          type: Sequelize.ENUM('SEAMSTRESS', 'CUTTER', 'MANAGER'),
          allowNull: false,
        },

        userId: {
          type: Sequelize.UUID,
          allowNull: true,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'User',
            key: 'id',
          },
        },

        productionChainId: {
          type: Sequelize.UUID,
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'ProductionChain',
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

    // BisFunction
    await queryInterface.createTable(
      'BisFunction',
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

        order: {
          type: Sequelize.INTEGER,
          unique: true,
          allowNull: false,
        },

        type: {
          type: Sequelize.ENUM(
            'TAKE_CREDIT',
            'PAYOUT_CREDIT_FIXED_AMOUNT',
            'HIRE_EMPLOYEE',
            'FIRE_EMPLOYEE',
            'PAYOUT_SALARIES',
            'BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT',
            'BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT',
            'PRODUCE_PRODUCTS',
            'SELL_PRODUCT_FIXED',
            'CHANGE_PRODUCT_RESOURCE_EQUIPMENT_PRICE',
          ),
          allowNull: false,
        },

        meta: {
          type: Sequelize.JSON,
          allowNull: true,
        },

        startPeriod: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        endPeriod: {
          type: Sequelize.INTEGER,
          allowNull: true,
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

        userId: {
          type: Sequelize.UUID,
          allowNull: true,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'User',
            key: 'id',
          },
        },

        productionChainId: {
          type: Sequelize.UUID,
          allowNull: true,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'ProductionChain',
            key: 'id',
          },
        },

        equipmentId: {
          type: Sequelize.UUID,
          allowNull: true,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'Equipment',
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
