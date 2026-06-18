# Fix Image Transformation - Setup Guide

## Problem
The Replicate API key is configured but image transformation is failing with "404 - Resource Not Found" errors.

## Root Cause
The Replicate account needs proper setup to access image generation models.

## Solution

### Option 1: Update Replicate Account (Recommended)

1. **Log in to Replicate**
   - Go to https://replicate.com
   - Sign in with your account (dwise03-bit)

2. **Add Payment Method**
   - Click Settings → Billing
   - Add a credit card
   - This enables access to all models

3. **Verify API Access**
   ```bash
   curl https://api.replicate.com/v1/models \
     -H "Authorization: Token YOUR_API_KEY" | jq .
   ```

4. **Restart the API**
   ```bash
   docker compose restart wisetouch-api
   ```

### Option 2: Use a Different API Key

If you have another Replicate account:

1. Generate a new API key from that account
2. Update `.env` file:
   ```bash
   nano /home/ubuntu/wise-defense-saas/.env
   # Change: REPLICATE_API_KEY=new_key
   ```
3. Restart:
   ```bash
   docker compose restart wisetouch-api
   ```

### Option 3: Switch to Alternative Service

If you want to use a different service instead:

**OpenAI DALL-E:**
```javascript
// Edit transform-api.js to use OpenAI instead of Replicate
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

**Stability AI:**
```bash
# Get API from stability.ai
# Update code to call stability-ai.com/api/v1/generate
```

## Testing

After setup, test with:

```bash
# Check API status
curl http://localhost:5000/health

# Test transformation
curl -X POST http://localhost:5000/api/transform-image \
  -H "Content-Type: application/json" \
  -d '{
    "imageData": "data:image/png;base64,...",
    "prompt": "test"
  }'
```

## Troubleshooting

### 402 Payment Required
→ Account needs billing setup

### 404 Resource Not Found
→ Model version doesn't exist for this account

### 401 Unauthorized
→ API key is invalid

### 422 Invalid Input
→ Check request format

## Need More Help?

1. **Replicate Docs**: https://replicate.com/docs
2. **API Reference**: https://replicate.com/docs/api
3. **Model List**: https://replicate.com/models
4. **Support**: https://replicate.com/support

## Quick Checklist

- [ ] Replicate account created
- [ ] API key generated
- [ ] Payment method added
- [ ] API key set in `.env`
- [ ] Docker containers restarted
- [ ] Test request successful
