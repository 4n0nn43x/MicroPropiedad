# MicroPropiedad Backend

Backend API and Oracle service for the MicroPropiedad platform.

## Structure

```
backend/
├── src/
│   ├── index.js          # Main API server
│   └── oracle/
│       └── index.js      # Oracle service for off-chain data
├── api/                  # Additional API modules (future)
├── oracle-service/       # Oracle service modules (future)
├── package.json
└── .env.example
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Running

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Oracle Service Only
```bash
npm run oracle
```

## API Endpoints

### Health Check
```
GET /health
```

### Get All Properties
```
GET /api/properties
```

### Get Property by ID
```
GET /api/properties/:id
```

### Submit Payout (Oracle)
```
POST /api/oracle/submit-payout
Body: {
  "propertyId": "1",
  "amount": 1000000,
  "proof": "transaction_hash_or_proof"
}
```

## Oracle Service

The oracle service:
- Monitors off-chain rental payments
- Verifies payment proofs
- Submits verified data to smart contracts
- Triggers payout distributions

Currently runs as a cron job every hour. Adjust the schedule in `src/oracle/index.js` as needed.

## Future Enhancements

- [ ] Integrate with property management APIs
- [ ] Add authentication/authorization
- [ ] Implement KYC verification
- [ ] Add database for caching
- [ ] Implement webhook handlers
- [ ] Add comprehensive logging
- [ ] Set up monitoring and alerts
