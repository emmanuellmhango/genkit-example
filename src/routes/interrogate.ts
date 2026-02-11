import express from 'express';
import { interrogateFlow } from '../ai/interrogateFlow.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { question, currentSelection, metric } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const result = await interrogateFlow({
      question,
      currentSelection,
      metric
    });

    res.json(result);

  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
