import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review';
import { Product } from '../models/Product';

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = Number(req.params.id);
    if (!productId) return res.status(400).json({ message: "Invalid product ID" });

    const reviews = await Review.findAll({
      where: { productId },
      order: [['date', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { author, rating, comment } = req.body;
    const productId = Number(req.params.id);

    console.log("📥 Incoming review:", { productId, author, rating, comment });

    const review = await Review.create({
      productId,
      author,
      rating: Number(rating), // 👈 force number
      comment
    });

    await updateAverageRating(productId); // ⬅️ recompute after insert

    res.status(201).json(review);
  } catch (error) {
    console.error("❌ Failed to create review:", error);
    next(error);
  }
};


export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rating, comment } = req.body;
    const productId = Number(req.params.productId);
    const reviewId = Number(req.params.id);
    if (!productId || !reviewId) return res.status(400).json({ message: "Invalid parameters" });

    await Review.update({ rating, comment }, { where: { id: reviewId } });

    await updateAverageRating(productId);

    res.json({ message: 'Review updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = Number(req.params.productId);
    const reviewId = Number(req.params.id);
    if (!productId || !reviewId) return res.status(400).json({ message: "Invalid parameters" });

    await Review.destroy({ where: { id: reviewId } });

    await updateAverageRating(productId);

    res.json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

export const summarizeReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.findAll({ where: { productId: req.params.id } });

    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this product" });
    }

    const reviewTexts = reviews.map(r =>
      `${r.author}: ${r.comment} (Rating: ${r.rating})`
    ).join("\n");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Summarize these product reviews:\n${reviewTexts}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("🔴 OpenRouter error:", errorData);
      return res.status(500).json({ message: errorData.message || 'OpenRouter error' });
    }

    const data = await response.json();
    const summary = data.choices[0].message?.content;

    res.json({ summary });
  } catch (error) {
    console.error("🔥 summarizeReviews error:", error);
    next(error);
  }
};




const updateAverageRating = async (productId: number) => {
  const reviews = await Review.findAll({ where: { productId } });
  console.log("🧾 Raw reviews:", reviews.map(r => r.toJSON()));

  const ratings = reviews
    .map(r => Number(r.getDataValue('rating')))
    .filter(r => typeof r === 'number' && !isNaN(r));

  console.log("📋 Ratings found:", ratings);

  const avg = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    : null;

  console.log("🔢 Computed average rating:", avg);

  const product = await Product.findByPk(productId);
  if (product) {
    await product.update({ averageRating: avg });
    console.log(`✅ Updated averageRating for product ${productId}:`, avg);
  }
};



