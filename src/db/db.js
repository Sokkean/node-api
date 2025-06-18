import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // optional
  }
);

// Optional: test the connection
try {
  await db.authenticate();
  console.log('✅ Database connected');
} catch (error) {
  console.error('❌ Unable to connect to the database:', error);
}

export default db;
