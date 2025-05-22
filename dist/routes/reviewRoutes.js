"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const aiController_1 = require("../controllers/aiController");
const router = express_1.default.Router();
router.get('/:id/reviews', reviewController_1.getProductReviews);
router.post('/:id/reviews', reviewController_1.createReview);
router.put('/:productId/reviews/:id', reviewController_1.updateReview);
router.delete('/:productId/reviews/:id', reviewController_1.deleteReview);
router.get('/:id/reviews/summary', aiController_1.summarizeReviews);
exports.default = router;
