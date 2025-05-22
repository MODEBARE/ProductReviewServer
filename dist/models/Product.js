"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
exports.Product = db_1.sequelize.define('Product', {
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.TEXT },
    category: { type: sequelize_1.DataTypes.STRING },
    price: { type: sequelize_1.DataTypes.FLOAT },
    dateAdded: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    averageRating: { type: sequelize_1.DataTypes.FLOAT, defaultValue: 0 },
});
