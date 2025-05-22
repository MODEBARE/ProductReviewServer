"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProducts = exports.getAllProducts = void 0;
const Product_1 = require("../models/Product");
const sequelize_1 = require("sequelize");
const getAllProducts = async (req, res, next) => {
    try {
        const { page = 1, category } = req.query;
        const limit = 10;
        const offset = (Number(page) - 1) * limit;
        const whereClause = {};
        if (category) {
            whereClause.category = category;
        }
        const products = await Product_1.Product.findAll({
            where: whereClause,
            order: [['dateAdded', 'DESC']],
            limit,
            offset
        });
        res.json(products);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProducts = getAllProducts;
const searchProducts = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const products = await Product_1.Product.findAll({
            where: {
                name: {
                    [sequelize_1.Op.iLike]: `%${q}%`
                }
            }
        });
        res.json(products);
    }
    catch (error) {
        next(error);
    }
};
exports.searchProducts = searchProducts;
