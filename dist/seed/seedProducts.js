"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = require("../models/Product");
const db_1 = require("../config/db");
async function seed() {
    try {
        await db_1.sequelize.sync({ force: true });
        await Product_1.Product.bulkCreate([
            { name: 'MacBook Pro', description: 'Apple M1 chip', category: 'Electronics', price: 1499 },
            { name: 'Sony WH-1000XM5', description: 'Noise Cancelling Headphones', category: 'Audio', price: 399 },
            { name: 'Standing Desk', description: 'Adjustable height', category: 'Furniture', price: 299 }
        ]);
        console.log('✅ Products seeded successfully.');
        process.exit(0); // Exit without error
    }
    catch (error) {
        console.error('❌ Failed to seed products:', error);
        process.exit(1); // Exit with error
    }
}
seed();
