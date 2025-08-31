const express = require("express");
const PredictionController = require("../controllers/PredictionController");

const router = express.Router();

// Next-Word Prediction Route
router.post("/predict-next-word", PredictionController.predictNextWord);

module.exports = router;