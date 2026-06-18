# Wise Touch - Image Upload & Generator Setup Guide

## What's New

Added **Image Transformer** feature to Wise Touch:
- Upload any image
- Select a Wise Touch system style
- AI transforms the image to match that style
- Download the result

## Quick Start

### 1. Get Your Replicate API Key

1. Visit https://replicate.com/signin
2. Create an account (free, no credit card needed for testing)
3. Go to your API tokens page
4. Copy your API token

### 2. Set Environment Variable

**For local development:**
```bash
export REPLICATE_API_KEY=your_token_here
npm run api  # starts the API server on port 5000
```

**For Docker deployment:**
Add to your `.env` file or `docker-compose.yml`:
```bash
REPLICATE_API_KEY=your_token_here
```

### 3. Start the Services

**Local development (two terminals):**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: API Server
npm run api
```

The frontend will proxy `/api/*` calls to `http://localhost:5000`.

**Docker deployment:**
```bash
cd /home/ubuntu/wise-defense-saas
docker compose up -d --build wisetouch wisetouch-api
```

### 4. Use Image Transformer

1. Open Wise Touch at `http://localhost:3003` (or `http://<vps-ip>:3003`)
2. Click **"Image Transform"** tab
3. Upload an image
4. Select a Wise Touch system
5. Click **"Transform Image"**
6. Wait for AI to process (30-60 seconds)
7. Download the result

## How It Works

- **Frontend** (React/Vite): Image upload UI, prompt builder
- **API Server** (Node.js/Express): Handles image transformation using Replicate's Stable Diffusion model
- **Replicate**: Cloud-based AI image generation service

## Troubleshooting

### "REPLICATE_API_KEY not configured"
→ Make sure you've set the environment variable and restarted the API server

### Request timeout after 4 minutes
→ Complex transformations can take time. Replicate defaults are usually 30-60 seconds.

### CORS errors
→ Make sure the API server is running on port 5000 and accessible

### API health check
```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status":"ok","hasApiKey":true,"apiConfigured":true}
```

## File Structure

```
wisetouch/
├── src/
│   └── App.jsx                 # Frontend (added Image Transform tab)
├── transform-api.js            # API server (new)
├── Dockerfile                  # Frontend image
├── Dockerfile.api              # API server image (new)
├── vite.config.js              # Added API proxy (new)
├── nginx.conf                  # Added API routing (new)
├── docker-compose.snippet.yml  # Updated with API service (updated)
├── package.json                # Added dependencies (updated)
└── .env.example                # Environment template (new)
```

## Development Notes

- Frontend runs on port 3003 (nginx serving React build)
- API runs on port 5000
- In dev mode, Vite proxies `/api/*` → `http://localhost:5000/api/*`
- In prod, nginx proxies `/api/*` → `http://wisetouch-api:5000/api/*`
- Image transformation uses Replicate's Stable Diffusion img2img model
- Base64 image data is sent directly to Replicate API (50MB limit)

## Customization

**To use a different AI model:**
Edit `transform-api.js` and change the `version` ID in the Replicate API call.

**To adjust transformation strength:**
Edit `transform-api.js` and change the `strength` parameter (0.0-1.0):
- Lower = more original image preserved
- Higher = more style transformation

**To change guidance scale:**
Edit the `guidance_scale` parameter (higher = closer to prompt):
```js
guidance_scale: 7.5  // default
```

## Costs

- **Replicate free tier**: 1000 free predictions/month (includes testing)
- Image transformations typically cost $0.01-0.02 each after free tier
- Sign up for free at https://replicate.com

## Support

- Replicate docs: https://replicate.com/docs
- Check `/health` endpoint for API status
- Check browser console for frontend errors
- Check container logs: `docker logs wise-touch-api`
