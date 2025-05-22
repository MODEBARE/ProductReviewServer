import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config(); // ✅ load .env

console.log("Using DB Config:");
console.log("  Name:", process.env.DB_NAME);
console.log("  User:", process.env.DB_USER);
console.log("  Host:", process.env.DB_HOST);

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'fallback_db',
  process.env.DB_USER || 'fallback_user',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); // TEMP: Ensure schema is up to date
    console.log('✅ Database connected...');

    // ✅ Automatically sync tables if they don't exist
    await sequelize.sync({ alter: true });
    console.log('✅ All models synced...');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};
