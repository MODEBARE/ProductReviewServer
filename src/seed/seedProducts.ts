import { Product } from '../models/Product';
import { sequelize } from '../config/db';

async function seed() {
  try {
    await sequelize.sync({ force: true });

    await Product.bulkCreate([
      { name: 'MacBook Pro', description: 'Apple M1 chip', category: 'Electronics', price: 1499 },
      { name: 'Sony WH-1000XM5', description: 'Noise Cancelling Headphones', category: 'Audio', price: 399 },
      { name: 'Standing Desk', description: 'Adjustable height', category: 'Furniture', price: 299 }
    ]);

    console.log('✅ Products seeded successfully.');
    process.exit(0); // Exit without error
  } catch (error) {
    console.error('❌ Failed to seed products:', error);
    process.exit(1); // Exit with error
  }
}

seed();
