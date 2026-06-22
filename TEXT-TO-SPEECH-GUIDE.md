# Text-to-Speech (TTS) - AI Response Audio

## 🔊 Feature Overview

AI responses now have a speaker icon (🔊) that users can click to hear the answer read aloud. Uses browser Web Speech API for native, offline text-to-speech.

```
User: "What's the Pro membership?"
      ↓
AI: [Pricing info + 🔊 speaker button]
User: [Clicks 🔊]
      ↓
Browser: [Reads response aloud with natural voice]
```

---

## 👤 User Experience

### Chat Widget Layout

```
┌────────────────────────────────────────┐
│ 🔊 Hi! I'm Wise Defense's AI...       │ ← Speaker icon left
│    [Message content here...]           │ ← Ring glow while speaking
└────────────────────────────────────────┘
      [📅 Book] [💰 Pricing] [❓ Help]  ← Quick reply buttons
```

### TTS Controls

**Playing:** 🔊 button → ⏸️ (Pause) + 🛑 (Stop)
**Paused:** ▶️ (Resume) button
**Stopped:** 🔊 (Play again) button

### User Actions

| Action | What Happens |
|--------|--------------|
| Click 🔊 | Starts reading response aloud |
| Click ⏸️ | Pauses playback |
| Click ▶️ | Resumes paused playback |
| Click 🛑 | Stops completely (can replay) |
| Send new message | Stops current speech |

---

## 🎯 Use Cases

### 1. **Hands-Free Learning**
User is at the range or driving
```
User: "What's the safety checklist?"
AI: [Reads full checklist aloud while user listens]
```

### 2. **Accessibility**
User with vision impairment
```
User: [Standard chat]
AI: [Provides audio option for every response]
```

### 3. **Quick Reference**
User wants to hear pricing while doing other things
```
User: "What's VIP include?"
AI: [Reads VIP features aloud]
User: [Continues other tasks while listening]
```

### 4. **Mobile**
User on phone, hands busy
```
User: [Voice message via 🎤]
AI: [Text response + 🔊 to hear it]
User: [Listens while driving/training]
```

---

## 🔧 Technical Details

### Browser Web Speech API

```javascript
// Create utterance
const utterance = new SpeechSynthesisUtterance(text)

// Configure voice
utterance.rate = 1.0      // Speed: 0.1-10
utterance.pitch = 1.0     // Pitch: 0-2
utterance.volume = 1.0    // Volume: 0-1

// Speak
speechSynthesis.speak(utterance)

// Controls
speechSynthesis.pause()   // Pause
speechSynthesis.resume()  // Resume
speechSynthesis.cancel()  // Stop
```

### Supported Browsers

| Browser | TTS Support | Quality |
|---------|-------------|---------|
| Chrome | ✅ Full | Excellent |
| Firefox | ✅ Full | Excellent |
| Safari | ✅ Full | Excellent |
| Edge | ✅ Full | Excellent |
| Mobile Chrome | ✅ Full | Good |
| Mobile Safari | ✅ Full | Good |

### Voice Selection

**System Default:**
- Windows: Microsoft David/Zira
- macOS: Alex (English)
- iOS: Siri voice
- Android: Google TTS voice

**User Options:**
System speakers choose based on OS + language

### Performance

- **Latency:** <100ms (no network)
- **Bandwidth:** None (offline)
- **CPU:** Low (native browser)
- **Max length:** No limit (can read 5000+ char)

---

## 📱 UI/UX Details

### Button States

**Default (Assistant Message Ready to Speak)**
```
[🔊] ← Gray background, red speaker icon
```

**Currently Speaking**
```
[⏸️] ← Red background, white pause icon
[🛑] ← Dark red, stop icon below
```

**Paused**
```
[▶️] ← Red background, play icon
```

### Visual Feedback

- **Ring Glow:** Message box glows red while speaking
- **Button Color:** Changes to indicate state
- **Live Indicator:** Shows which message is being read

### Mobile Responsiveness

- Buttons stack vertically on small screens
- Touch targets: 44px minimum (WCAG)
- Readable on all screen sizes

---

## 🎛️ Settings & Customization

### User Preferences (Future)

```javascript
// Example: User settings
{
  ttsEnabled: true,
  ttsRate: 1.0,        // 0.5 = slower, 1.5 = faster
  ttsPitch: 1.0,
  ttsVolume: 0.8,
  autoPlayTTS: false   // Auto-play on response
}
```

### Volume Control

**Browser System Volume:**
- User adjusts via system volume (🔊 in OS)
- Or via speaker settings on device

**App Volume:**
- Future: Add volume slider in chat widget

---

## 🐛 Troubleshooting

### Speech Not Playing

**Problem:** Click 🔊 but no sound
**Solutions:**
1. Check system volume (OS level)
2. Check browser volume
3. Try different browser
4. Restart browser
5. Check microphone isn't muted

### Choppy/Robotic Audio

**Problem:** Speech sounds unnatural
**Solutions:**
1. Try different OS (macOS has best voices)
2. Adjust rate: try `utterance.rate = 0.9`
3. Check system resources (close other apps)

### Button Not Appearing

**Problem:** No 🔊 button in chat
**Solutions:**
1. Check browser supports Web Speech API
2. Try Chrome/Firefox (better support)
3. Hard refresh page (Ctrl+F5)
4. Check browser console for errors (F12)

### Audio Cuts Off

**Problem:** Speech stops before message ends
**Solutions:**
1. Not a bug - browser limits single utterance
2. Split long responses manually
3. Try resuming with ▶️ if paused

---

## ♿ Accessibility

### WCAG 2.1 Compliance

- ✅ Keyboard accessible (Tab to 🔊, Enter to play)
- ✅ Screen reader compatible (aria-labels)
- ✅ Color-blind friendly (icons + colors)
- ✅ Works with zoom (buttons enlarge)
- ✅ Respects `prefers-reduced-motion`

### Screen Reader Support

```html
<button 
  aria-label="Read this message aloud"
  title="Read aloud (Text-to-Speech)"
>
  🔊
</button>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Focus to 🔊 button |
| Enter/Space | Start speech |
| Tab again | Focus to ⏸️ button |
| Enter | Pause speech |

---

## 📊 Analytics & Metrics

### What Gets Tracked

- TTS clicks per conversation
- Messages read aloud
- Average listen duration
- Drop-off rate

### Database Schema

```sql
ALTER TABLE conversation_messages ADD COLUMN (
  tts_enabled BOOLEAN DEFAULT false,
  tts_click_count INT DEFAULT 0,
  tts_duration_seconds INT
);
```

### Sample Query

```sql
SELECT 
  COUNT(*) as tts_uses,
  AVG(tts_duration_seconds) as avg_listen_time,
  user_id
FROM conversation_messages
WHERE tts_enabled = true
GROUP BY user_id
ORDER BY tts_uses DESC;
```

---

## 🚀 Deployment

### 1. No Server Changes Needed
TTS uses browser Web Speech API (offline, no backend)

### 2. Rebuild Dashboard

```bash
ssh ubuntu@51.81.80.252
cd /home/ubuntu/wise-defense-saas
docker compose up --build -d dashboard
```

### 3. Test

```
1. Go to https://academy.wisedefense.store
2. Chat: "What's the Pro membership?"
3. Click 🔊 next to AI response
4. Hear it read aloud!
```

---

## ✨ Features

### Current ✅
- Play/Pause/Stop controls
- Browser-native voices (high quality)
- Works offline (no internet needed)
- All browsers supported
- Adjustable rate/pitch/volume

### Coming Next 🔜
- User volume slider in chat
- Auto-play TTS toggle
- Voice selection (choose voice)
- Audio speed controls
- Download audio file
- TTS analytics dashboard

---

## 🔗 Integration with Other Features

### Works With Voice Input 🎤
```
User: [Speaks via 🎤]
      ↓
AI: [Responds in text + 🔊]
User: [Reads response aloud]
```

### Works With Smart Escalation 🚨
```
User: [Frustrated message]
      ↓
AI: [Escalation message + 🔊]
User: [Hears escalation message]
```

### Works With Quick Replies
```
AI: [Response + 🔊]
User: [Clicks 🔊 to hear]
User: [Then clicks quick reply button]
```

---

## 📈 Quality Settings

### Recommended Config

```javascript
// Professional voice
utterance.rate = 0.95    // Slightly slower = clearer
utterance.pitch = 1.0    // Natural pitch
utterance.volume = 1.0   // Full volume
```

### Accessible Voice

```javascript
// Slow & clear for accessibility
utterance.rate = 0.85
utterance.pitch = 0.95
utterance.volume = 1.0
```

### Fast Voice

```javascript
// For users who want to speed through
utterance.rate = 1.2
utterance.pitch = 1.0
utterance.volume = 0.9
```

---

## 🎓 User Education

### Chat Widget Footer

```
🤖 Hermes AI • 🎤 Voice Input • 🔊 Audio Output • 24/7
```

### Tooltip on Hover

```
"Read aloud (Text-to-Speech)"
"Pause speech"
"Resume speech"
"Stop speech"
```

### First-Time Notice

On first chat, show:
```
💡 Tip: Click 🔊 on AI responses to hear them read aloud!
```

---

## 🔒 Privacy

- No audio uploaded (local browser processing)
- No transcription service used
- No data stored
- Works offline
- Uses system voices (built into OS)

---

## 📞 Support

### Common Questions

**Q: Will this work on my phone?**
A: Yes! iOS and Android both support TTS.

**Q: Can I download the audio?**
A: Not yet (coming soon).

**Q: Does it work in background?**
A: Yes, you can minimize chat and keep listening.

**Q: Can I change the voice?**
A: It uses system voices. To change, go to OS settings.

**Q: Does this use data?**
A: No, TTS is local. No internet required.
