# Smart Escalation & Voice Chat Features

## 🚨 Feature 3: Smart Escalation (Detect Frustrated Users)

### How It Works

**Sentiment Analysis Engine:**
- Detects frustration keywords: angry, frustrated, help, urgent, broken, error, etc.
- Analyzes intensity: ALL CAPS, exclamation marks, repeated question marks
- Assigns frustration score: 0.0 (calm) → 1.0 (extremely frustrated)

**Escalation Trigger:**
- User sends 2+ frustrated messages → auto-escalates to human agent
- Threshold: 0.5+ frustration score triggers escalation
- Discord alert sent immediately to support team with:
  - User ID
  - Frustration score (%)
  - Last message
  - Conversation ID

**User Experience:**
```
User: "This isn't working!! I'm so angry!!"
       [Frustration score: 0.85 - FRUSTRATED]
       
AI: "I understand you're having trouble. Let me connect you with 
     our support team right away. They'll get back to you within 2 hours.
     
     [Button: 👤 Talk to Human Now]
     [Button: ❓ Other Question]"
     
User: Clicks "Talk to Human" → Gets support contact info
Support Team: Receives Discord alert with full context
```

### Frustration Detection Examples

**High Frustration (0.8+):**
- "I CAN'T ACCESS MY COURSE!! HELP NOW!!!"
- "This is TERRIBLE. I want a refund immediately"
- "Been waiting 3 days. This is a waste of money"

**Medium Frustration (0.5-0.7):**
- "I'm having trouble with my booking"
- "This doesn't work and I'm frustrated"
- "Why isn't this working???"

**No Frustration (0.0-0.4):**
- "How do I book a session?"
- "What's the difference between Pro and VIP?"
- "Can I reschedule my class?"

---

## 🎤 Feature 4: Voice Chat

### How It Works

**Voice Recording:**
- Click 🎤 button in chat → starts recording
- Visual indicator shows "Recording... 3s" with pulse animation
- Max 60 seconds per message
- Click 🎤 again or wait 60s to stop

**Audio Processing:**
- Browser Web Speech API (no server required)
- Recorded audio sent to transcription service
- Text response returned to chat

**User Experience:**
```
User: [Clicks 🎤 button]
UI: [Red "Recording... 12s" indicator appears]
User: "What's included in the Pro membership?"
User: [Stops recording]
AI: [Transcribes & responds with info]
```

### Voice Recording UI

```
┌─────────────────────────────────┐
│ Recording... 24s [●]  [✕ Stop] │ ← Pulsing indicator
├─────────────────────────────────┤
│ Ask me anything... or click 🎤  │ ← Disabled during recording
├─────────────────────────────────┤
│ [🎤] [========== Send ========] │ ← Mic button + Send button
└─────────────────────────────────┘
```

### Browser Requirements

✅ Chrome/Chromium - Full support
✅ Firefox - Full support  
✅ Safari - Full support
✅ Edge - Full support
⚠️  Mobile browsers - May require HTTPS + microphone permission

---

## 🚀 Deployment

### 1. Update Environment Variables (VPS)

```bash
ssh -i ~/.ssh/id_ed25519 ubuntu@51.81.80.252
cd /home/ubuntu/wise-defense-saas

# Add Discord webhook for escalation alerts
echo "DISCORD_APPROVAL_WEBHOOK_URL=your_webhook_url_here" >> dashboard/.env.local

# Or use existing alerts webhook
grep DISCORD_ALERTS_WEBHOOK_URL .env
```

### 2. Rebuild Dashboard

```bash
docker compose up --build -d dashboard

# Verify rebuild
docker compose logs -f dashboard | grep -E "CHAT|escalation"
```

### 3. Test Smart Escalation

**In chat, type a frustrated message:**
```
"I'm angry! This doesn't work!!! Help now!!!"
```

**Expected:**
- Frustration score: ~0.75+
- AI responds with: "Let me connect you with support"
- Shows "👤 Talk to Human" button
- Discord alert sent to support team

### 4. Test Voice Chat

**In chat widget:**
1. Click 🎤 button (bottom left)
2. Say: "What's the Pro membership?"
3. Watch recording timer
4. Click 🎤 again to stop
5. Message appears as user input
6. AI responds

---

## 📊 How Smart Escalation Works (Technical)

### Frustration Score Calculation

```javascript
score = 0

// Keyword matching: +0.3 per keyword
if (message.includes('angry')) score += 0.3
if (message.includes('help')) score += 0.3

// ALL CAPS: +0.2 per word (max 0.6)
if ('HELP'.toUpperCase() === 'HELP') score += 0.2

// Exclamation marks: +0.1 per (max 0.5)
if (message.match(/!/g)) score += 0.1

// Question marks (repeated): +0.1 per extra ? (max 0.3)
if (message.match(/\?/g).length > 2) score += 0.1

// Final: clamp to 0-1
score = Math.min(1.0, score)

// Escalate if score >= 0.5
if (score >= 0.5) → ESCALATE
```

### Database Tracking

```sql
-- Frustration score stored per message
INSERT INTO conversation_messages (
  conversation_id, 
  sender, 
  content, 
  frustration_score,  -- NEW
  created_at
) VALUES (...)

-- Query escalation history
SELECT COUNT(*) FROM conversation_messages
WHERE conversation_id = $1 
AND frustration_score >= 0.5
```

### Discord Alert Webhook

```json
{
  "title": "🚨 Chat Escalation Alert",
  "fields": [
    {"name": "User ID", "value": "guest"},
    {"name": "Frustration Score", "value": "75%"},
    {"name": "Conversation ID", "value": "1234567"},
    {"name": "Last Message", "value": "I'm very frustrated..."}
  ]
}
```

---

## 📱 Voice Chat - Technical Details

### Browser Web Speech API

```javascript
// Request microphone
const stream = await navigator.mediaDevices.getUserMedia({ 
  audio: true 
})

// Record audio chunks
const mediaRecorder = new MediaRecorder(stream)
mediaRecorder.ondataavailable = (event) => {
  audioChunks.push(event.data)
}

// Stop and get blob
mediaRecorder.onstop = () => {
  const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
  // Send to transcription service
}
```

### Transcription Flow

1. Browser records 🎤 audio as WebM
2. Blob sent to `/api/chat` endpoint
3. (Optional) Whisper API or similar transcribes
4. Transcribed text sent as chat message
5. AI responds normally

---

## 🔧 Troubleshooting

### Escalation Not Triggering

**Problem:** User frustrated but no alert sent
- Check Discord webhook URL is set: `grep DISCORD_APPROVAL_WEBHOOK_URL .env`
- Check logs: `docker compose logs dashboard | grep escalation`
- Ensure 2+ frustrated messages (first message is just logged)

### Voice Recording Not Working

**Problem:** Microphone button doesn't respond
- Check browser allows microphone: Settings → Privacy → Microphone
- Ensure HTTPS (some browsers block on HTTP)
- Check browser console for errors: F12 → Console
- Try Chrome/Firefox if Safari doesn't work

**Permission Denied:**
```
Error: NotAllowedError: Microphone access denied
```
→ Go to browser settings and allow microphone for this site

### Audio Not Transcribing

**Problem:** Recording works but no transcription
- Voice transcription is in beta (placeholder for now)
- Currently prompts user to type their message
- Full Whisper API integration coming next

---

## 📈 Analytics

### View Escalations

```bash
# SSH to VPS
ssh ubuntu@51.81.80.252

# Query database
psql wisedefense

SELECT 
  conversation_id,
  COUNT(*) as frustrated_messages,
  MAX(frustration_score) as peak_frustration,
  created_at
FROM conversation_messages
WHERE frustration_score >= 0.5
GROUP BY conversation_id, created_at
ORDER BY created_at DESC
LIMIT 10;
```

### Discord Alerts Channel

Escalation alerts sent to: `#article-approvals` (configurable)
- Shows when + why user was escalated
- Includes user ID for follow-up
- Helps support team prioritize

---

## ✨ What's Next

**Phase 2 Options:**
1. Full voice transcription (Whisper API)
2. Text-to-speech AI responses (play audio back)
3. Escalation analytics dashboard
4. Member profile integration
5. Upsell recommendations

---

## 🎯 Quick Links

- Test escalation: Type "I'm angry!" in chat
- Test voice: Click 🎤 button and speak
- Check alerts: Go to Discord #article-approvals channel
- Monitor: `docker compose logs -f dashboard`
- Database: `psql wisedefense` on VPS
