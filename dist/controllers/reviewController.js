"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeReviews = exports.deleteReview = exports.updateReview = exports.createReview = exports.getProductReviews = void 0;
const Review_1 = require("../models/Review");
const Product_1 = require("../models/Product");
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
const getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review_1.Review.findAll({
            where: { productId: req.params.id },
            order: [['date', 'DESC']]
        });
        res.json(reviews);
    }
    catch (error) {
        next(error);
    }
};
exports.getProductReviews = getProductReviews;
const createReview = async (req, res, next) => {
    try {
        const { author, rating, comment } = req.body;
        const productId = Number(req.params.id);
        const review = await Review_1.Review.create({ productId, author, rating, comment });
        const reviews = await Review_1.Review.findAll({ where: { productId } });
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Product_1.Product.update({ averageRating: avg }, { where: { id: productId } });
        res.status(201).json(review);
    }
    catch (error) {
        next(error);
    }
};
exports.createReview = createReview;
const updateReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const { productId, id } = req.params;
        await Review_1.Review.update({ rating, comment }, { where: { id } });
        const reviews = await Review_1.Review.findAll({ where: { productId } });
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Product_1.Product.update({ averageRating: avg }, { where: { id: productId } });
        res.json({ message: 'Review updated' });
    }
    catch (error) {
        next(error);
    }
};
exports.updateReview = updateReview;
const deleteReview = async (req, res, next) => {
    try {
        const { productId, id } = req.params;
        await Review_1.Review.destroy({ where: { id } });
        const reviews = await Review_1.Review.findAll({ where: { productId } });
        const avg = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        await Product_1.Product.update({ averageRating: avg }, { where: { id: productId } });
        res.json({ message: 'Review deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteReview = deleteReview;
const summarizeReviews = async (req, res, next) => {
    try {
        const reviews = await Review_1.Review.findAll({ where: { productId: req.params.id } });
        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this product" });
        }
        const reviewTexts = reviews.map(r => `${r.author}: ${r.comment} (Rating: ${r.rating})`).join("\n");
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Summarize these product reviews:\n${reviewTexts}` }]
        });
        const summary = response.choices[0].message?.content;
        res.json({ summary });
    }
    catch (error) {
        next(error);
    }
};
exports.summarizeReviews = summarizeReviews;
