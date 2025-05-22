import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { Review } from '../models/Review';
import { Op } from 'sequelize';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, category } = req.query;
    const limit = 10;
    const offset = (Number(page) - 1) * limit;

    const whereClause: any = {};
    if (category) {
      whereClause.category = category;
    }

    const products = await Product.findAll({
      where: whereClause,
      order: [['dateAdded', 'DESC']],
      limit,
      offset
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const products = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${q}%`
        }
      }
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};