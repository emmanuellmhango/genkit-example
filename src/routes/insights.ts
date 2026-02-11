import express from 'express';
import { insightFlow } from '../ai/insightsFlow.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { data, metric, forecastYears } = req.body;

    if (!data || !data.length) {
      return res.status(400).json({ error: 'No data provided.' });
    }

    const result = await insightFlow({
      data,
      metric,
      forecastYears,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
