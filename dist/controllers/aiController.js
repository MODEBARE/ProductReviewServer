"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeReviews = void 0;
const Review_1 = require("../models/Review");
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
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
