import { sequelize } from '../config/db';
import { Product } from '../models/Product';
import { Review } from '../models/Review';

async function seed() {
  try {
    await sequelize.sync({ force: true });

    const now = new Date();

    const products = await Product.bulkCreate([
      {
        name: 'MacBook Pro',
        description: 'Apple M1 chip, 16GB RAM, 512GB SSD',
        category: 'Electronics',
        price: 1499,
        dateAdded: now,
        averageRating: 0,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Noise Cancelling Wireless Headphones',
        category: 'Audio',
        price: 399,
        dateAdded: now,
        averageRating: 0,
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Standing Desk',
        description: 'Ergonomic adjustable height desk',
        category: 'Furniture',
        price: 299,
        dateAdded: now,
        averageRating: 0,
        createdAt: now,
        updatedAt: now
      }
    ]);

    const reviewsData = [
      { productId: products[0].id, author: 'Elijah', rating: 5, comment: 'Fantastic performance!' },
      { productId: products[0].id, author: 'Peace', rating: 4, comment: 'Great battery life.' },
      { productId: products[1].id, author: 'Alex', rating: 5, comment: 'Amazing sound quality.' },
      { productId: products[2].id, author: 'Sam', rating: 3, comment: 'Good but slightly wobbly.' }
    ];

    await Review.bulkCreate(
      reviewsData.map(r => ({
        ...r,
        date: now,
        createdAt: now,
        updatedAt: now
      }))
    );

    // Recalculate average rating
    for (const product of products) {
      const productReviews = reviewsData.filter(r => r.productId === product.id);
      const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      await product.update({ averageRating: avg });
    }

    console.log('✅ Seed complete!');
    process.exit();
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
