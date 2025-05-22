import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger/swagger.json';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorMiddleware';
import productRoutes from './routes/productRoutes';
import reviewRoutes from './routes/reviewRoutes';

dotenv.config();
console.log('Loaded API key:', process.env.OPENAI_API_KEY);


const app = express();
const PORT = process.env.PORT || 5050;

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/products', reviewRoutes);

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});