import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MicroPropiedad Backend API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.get('/api/properties', async (req, res) => {
  try {
    // TODO: Fetch properties from Stacks blockchain
    res.json({
      properties: [],
      message: 'Property fetching from blockchain to be implemented'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Fetch specific property from blockchain
    res.json({
      property: null,
      message: `Property ${id} fetching to be implemented`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Oracle endpoint (for property owners to submit rental income proofs)
app.post('/api/oracle/submit-payout', async (req, res) => {
  try {
    const { propertyId, amount, proof } = req.body;

    if (!propertyId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Verify proof and submit to blockchain
    res.json({
      success: true,
      message: 'Payout submission to be implemented',
      propertyId,
      amount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MicroPropiedad Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏢 API endpoint: http://localhost:${PORT}/api/properties`);
});

export default app;
