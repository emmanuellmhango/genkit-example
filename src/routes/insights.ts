import express from 'express';
import {
  insightsGeneratorFlow,
  InsightsInputSchema,
} from '../ai/insightsFlow.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const input = InsightsInputSchema.parse(req.body);
    const result = await insightsGeneratorFlow(input);
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({
      error: err.message,
      details: err.errors,
    });
  }
});

export default router;
