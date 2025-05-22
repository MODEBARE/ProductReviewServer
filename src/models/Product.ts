// import { DataTypes } from 'sequelize';
// import { sequelize } from '../config/db';

// export const Product = sequelize.define('Product', {
//   name: { type: DataTypes.STRING, allowNull: false },
//   description: { type: DataTypes.TEXT },
//   category: { type: DataTypes.STRING },
//   price: { type: DataTypes.FLOAT },
//   dateAdded: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//   averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
// });

// import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
// import { sequelize } from '../config/db';

// export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
//   declare id: CreationOptional<number>;
//   declare name: string;
//   declare description: string;
//   declare category: string;
//   declare price: number;
//   declare dateAdded: Date;
//   declare averageRating: number | null;

//   declare createdAt: Date;
//   declare updatedAt: Date;
// }

// Product.init({
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: DataTypes.STRING,
//   description: DataTypes.TEXT,
//   category: DataTypes.STRING,
//   price: DataTypes.FLOAT,
//   dateAdded: DataTypes.DATE,
//   averageRating: {
//     type: DataTypes.FLOAT,
//     defaultValue: 0
//   },
//   createdAt: DataTypes.DATE,
//   updatedAt: DataTypes.DATE
// }, {
//   sequelize,
//   modelName: 'Product',
// });


import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/db';

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare category: string;
  declare price: number;
  declare dateAdded: Date;
  declare averageRating: number | null; // ✅ Include this
  declare createdAt: Date;
  declare updatedAt: Date;
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  category: DataTypes.STRING,
  price: DataTypes.FLOAT,
  dateAdded: DataTypes.DATE,
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'Product',
});
