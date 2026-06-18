# Wise Touch Prompt Shop — Standalone Service

Self-contained React/Vite app with integrated image transformation. Features include:
- Prompt directory with 200+ systems and subsystems
- Favorites management via localStorage
- Hybrid builder (4-system blend)
- **Image Transformer**: Upload images and apply Wise Touch system styles using AI (Replicate API)

## Setup Image Transformation (Optional)

To enable the **Image Transformer** feature (upload image + apply Wise Touch styles):

1. **Get a Replicate API key**:
   - Visit https://replicate.com/signin
   - Create an account and generate an API token
   - Copy your token

2. **Set the environment variable**:
   ```bash
   # In .env or docker-compose environment
   REPLICATE_API_KEY=your_token_here
   ```

3. Image transformer will automatically be available in the "Image Transform" tab once the API is running.

## Deploy on the VPS (wise-defense-saas stack)

1. Upload this whole `wisetouch/` folder to:
   ```
   /home/ubuntu/wise-defense-saas/wisetouch
   ```
   e.g. via scp:
   ```bash
   scp -r wisetouch ubuntu@<vps-ip>:/home/ubuntu/wise-defense-saas/
   ```

2. Edit `/home/ubuntu/wise-defense-saas/docker-compose.yml` and add the block from `docker-compose.snippet.yml` under `services:`, next to `dashboard-v3`.

3. Add REPLICATE_API_KEY to your .env file (optional, but required for image transformation):
   ```bash
   echo "REPLICATE_API_KEY=your_replicate_token_here" >> /home/ubuntu/wise-defense-saas/.env
   ```

4. Build and start it:
   ```bash
   cd /home/ubuntu/wise-defense-saas
   docker compose up -d --build wisetouch wisetouch-api
   ```

5. Verify:
   ```bash
   docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}" | grep wisetouch
   curl -I http://localhost:3003
   curl http://localhost:5000/health  # Optional: check API health
   ```

6. Reachable at `http://<vps-ip>:3003`, same pattern as dashboard-v2 (3001) and dashboard-v3 (3002).
   - Frontend: `http://<vps-ip>:3003`
   - API health: `http://<vps-ip>:5000/health`

## Notes

- Ports: 3003 (frontend), 5000 (API) — both free on the VPS as of last check.
- No Traefik labels needed — this stack's Traefik has no HTTPS entrypoint configured and isn't used for routing by any current service; this follows the same direct-port pattern as the rest.
- Favorites persist via browser localStorage only — per-device, no sync across machines.
- **Image Transformer** requires REPLICATE_API_KEY in .env. Without it, the feature will show an error but won't break the rest of the app.
- To update content later (e.g. add new systems/subsystems to `src/App.jsx` or update `transform-api.js`):
  ```bash
  cd /home/ubuntu/wise-defense-saas
  docker compose up -d --build wisetouch wisetouch-api
  ```
- If you later get a domain and want to move this (or the whole stack) behind Traefik with HTTPS, that's a separate, slightly bigger change — flag it and it can be set up properly rather than bolted on.
- The transform API uses Replicate's Stable Diffusion img2img model. To use a different model, edit `transform-api.js` and change the model version ID.
