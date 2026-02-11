import express from 'express';
import { analyzeSeries } from '../utils/analyzeSeries.js';
import { insightFlow } from '../ai/insightsFlow.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { data, metric, forecastYears } = req.body;

    const values = data
      .map((d: any) => d[metric])
      .filter((v: any) => typeof v === 'number');

    if (!values.length) {
      return res.status(400).json({ error: 'No numeric values found.' });
    }

    const analysis = analyzeSeries(values);

    const result = await insightFlow({
      metric,
      forecastYears,
      analysis,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});


export default router;
