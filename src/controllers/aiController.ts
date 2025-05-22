import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review';

export const summarizeReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;

    const reviews = await Review.findAll({ where: { productId } });

    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this product" });
    }

    const reviewTexts = reviews.map(r =>
      `${r.author}: ${r.comment} (Rating: ${r.rating})`
    ).join('\n');

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/gpt-4', // or any model you prefer
        messages: [
          {
            role: 'user',
            content: `Summarize these product reviews:\n${reviewTexts}`,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const summary = response.data.choices[0]?.message?.content;
    res.json({ summary });
  } catch (error) {
    console.error('🔥 summarizeReviews error:', error);
    next(error);
  }
};
