import express from 'express';

const router = express.Router();

router.get('/latest', async (req, res) => {
  try {
    const response = await fetch('http://51.81.80.252:8082/latest.json');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

export default router;
