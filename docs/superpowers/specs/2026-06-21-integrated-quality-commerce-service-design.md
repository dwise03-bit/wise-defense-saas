# Integrated Content Quality + E-Commerce + Customer Service System
**Design Spec** | June 21, 2026

## Overview

Build an integrated ecosystem for Wise Defense that combines:
1. **AI Content Quality Scoring** — Intelligent evaluation and filtering of content
2. **Merch E-Commerce** — Full e-commerce store with hybrid fulfillment
3. **Product Recommendations** — Automatic product suggestions in content
4. **AI Customer Service Chat** — Full support on Discord + Website

All systems are independent but connected. Zero startup cost. Designed to scale from solo operation to a team.

---

## 1. Content Quality Scoring System

### 1.1 Scoring Dimensions (0-100 each)

Content is evaluated on:

1. **Relevance Score** — How directly does this connect to 2A rights, gun policy, constitutional issues?
2. **Source Credibility** — Is the source reputable? Does it cite credible sources? Any red flags?
3. **Engagement Potential** — Would the audience find this interesting, shareable, discussion-worthy?
4. **Brand Alignment** — Does tone/messaging match Wise Defense values and voice?
5. **Fact-Check Score** — Are claims verifiable? Any misinformation or sensationalism?
6. **Uniqueness Score** — Is this new analysis, or repackaged content everyone's already seen?

### 1.2 Quality Gates with Auto-Filtering

**Moderate thresholds** balance quality and volume:

| Dimension | Minimum Score | Rationale |
|-----------|--------------|-----------|
| Relevance | 70 | Must be clearly on-topic |
| Credibility | 75 | Source must be trustworthy |
| Fact-Check | 75 | Core claims must be verifiable |
| Brand Alignment | 65 | Some flexibility for diverse voices |
| Engagement | 60 | Allow niche but quality content |
| Uniqueness | 50 | Minimal — allow some reference content |

**Combined threshold:** Average score must be ≥68 to proceed

**Filtering behavior:**
- Below threshold → Auto-rejected with reason
- You can force-approve low-scoring content (trains the model)

### 1.3 Human Feedback Loop

**What gets captured:**
- Your decision (approve/reject/modify)
- What changed (rewrote headline, fact-checked claim, etc.)
- Original vs. new scores
- Notes explaining why

**Monthly retraining:**
- Ollama analyzes your decisions for patterns
- Updates scoring weights based on your behavior
- New model deployed automatically

**Example patterns learned:**
- You always reject sensationalist headlines → Ollama learns to penalize those
- You approve credible-but-low-engagement content → Ollama adjusts engagement weight
- You flag specific sources as unreliable → Model learns to distrust them

### 1.4 Database Schema: Quality Scoring

```
quality_scores
├─ id (PK)
├─ article_id (FK → news_articles)
├─ gate_number (1-4)
├─ relevance_score (0-100)
├─ credibility_score (0-100)
├─ engagement_score (0-100)
├─ brand_alignment_score (0-100)
├─ fact_check_score (0-100)
├─ uniqueness_score (0-100)
├─ average_score (computed)
├─ meets_threshold (boolean)
├─ created_at
└─ updated_at

human_feedback
├─ id (PK)
├─ score_id (FK → quality_scores)
├─ decision (approve/reject/modify)
├─ notes (text)
├─ changes_made (json)
├─ old_scores (json)
├─ new_scores (json)
└─ created_at

news_articles (modified columns added)
├─ current_quality_score (numeric)
├─ is_filtered (boolean)
├─ filter_reason (text)
└─ override_reason (text)
```

---

## 2. Merch E-Commerce System

### 2.1 Product Catalog (5-20 SKUs)

**Product data structure:**
```
products
├─ id (PK)
├─ name (e.g., "Wise Defense T-Shirt")
├─ description (text)
├─ category (apparel, accessories, digital)
├─ price (numeric)
├─ cost (for profit tracking)
├─ sku (unique)
├─ images (url array)
├─ stock_count (integer)
├─ is_dropship (boolean)
├─ supplier_id (FK if dropship)
├─ related_topics (array — "2A", "rights", "self-defense")
├─ created_at
└─ updated_at
```

**Categories:**
- Apparel (shirts, hats, hoodies)
- Accessories (patches, stickers, pins)
- Digital (guides, courses, PDFs)
- Partnerships (affiliate products)

### 2.2 Shopping & Checkout

**Tech stack:**
- Stripe for payments (free tier + per-transaction %)
- Shopping cart in database + session
- Order confirmations via Resend (free tier)

**Checkout flow:**
1. User adds products to cart
2. Checkout page (email, address, payment info)
3. Stripe processes payment
4. Order created in database
5. Confirmation emails sent (customer + you)

### 2.3 Order Management

**Orders table:**
```
orders
├─ id (PK)
├─ customer_email
├─ customer_address
├─ items (json array — products + quantities)
├─ total_price (numeric)
├─ status (pending, processing, shipped, delivered)
├─ tracking_number (optional)
├─ created_at
└─ updated_at
```

**Dashboard for you:**
- New orders list
- Filter by status (pending, dropship, in-house)
- One-click actions (mark shipped, add tracking)

### 2.4 Fulfillment Workflow (Hybrid)

**Dropship products:**
1. Order created in database
2. You receive notification
3. Forward order to supplier (or integrate API)
4. Supplier ships directly to customer
5. Update tracking in orders table

**In-house products:**
1. Order created
2. You pack and ship
3. Update tracking in database
4. Send shipping notification to customer

Dashboard clearly shows which orders need your action.

### 2.5 Database Schema: E-Commerce

```
products (see 2.1)
orders (see 2.3)

order_items (detailed line items)
├─ id (PK)
├─ order_id (FK → orders)
├─ product_id (FK → products)
├─ quantity
├─ unit_price
└─ subtotal

suppliers (for dropship)
├─ id (PK)
├─ name
├─ api_endpoint (if automatable)
├─ contact_email
└─ api_key (encrypted)
```

---

## 3. Product Recommendation System

### 3.1 How Recommendations Work

**After article passes quality gates:**

1. Ollama analyzes article topics ("constitutional rights", "self-defense", "gun rights")
2. Matches against product tags
3. Scores relevance (0-100) for each matching product
4. Returns top 3 recommendations ranked by relevance

**Example:**
```
Article: "Supreme Court Affirms 2A Rights"
Topics: ["constitutional rights", "second amendment", "gun rights"]

Matches:
- Holster (tagged: "self-defense", "second amendment") → Relevance: 92
- T-shirt (tagged: "second amendment", "patriotic") → Relevance: 78
- Guide (tagged: "constitutional rights", "legal") → Relevance: 85

Top recommendation: Holster (92)
```

### 3.2 Where Recommendations Appear

- **Discord posts** — "Check out this: [product link]"
- **YouTube descriptions** — Product links at bottom
- **Social media posts** — "Recommended merch: [product]"
- **Email newsletters** — If you send regular updates

### 3.3 Tracking & Learning

**Recommendations table:**
```
product_recommendations
├─ id (PK)
├─ article_id (FK → news_articles)
├─ product_id (FK → products)
├─ relevance_score (0-100)
├─ was_clicked (boolean)
├─ conversion (boolean — did they buy?)
├─ created_at
└─ updated_at
```

Tracks which recommendations actually convert → informs future suggestions.

---

## 4. AI Customer Service Chat System

### 4.1 Capabilities

Ollama-powered chat agent trained to handle:

- **Order questions** — Status, tracking, delivery, returns, refunds
- **Product questions** — Details, sizing, availability, compatibility
- **Account/Billing** — Passwords, payment issues, email changes
- **Policy questions** — Shipping, returns, refunds, privacy
- **General support** — Bugs, issues, feedback

### 4.2 Knowledge Base

Agent has access to:
- **Orders database** — Customer order history (lookup by email/order ID)
- **Product catalog** — All product details, pricing, availability
- **Policies** — Shipping, returns, refunds, privacy, FAQs
- **FAQ database** — Pre-written answers for common questions

### 4.3 Chat Interfaces

**Discord:**
- Users DM the bot (`@WiseDefense Support`)
- Bot responds in real-time
- Can pull order history if user provides email/order ID
- Friendly, natural language responses

**Website:**
- Chat widget (bottom-right corner of store)
- Collects customer email first
- Can look up orders and provide personalized service
- Same AI agent, same knowledge base

### 4.4 Chat Flow Examples

**Example 1: Order tracking**
```
User: "Where's my order?"
Bot: "I can help! What's your order number or email?"
User: "123456"
Bot: "Found it! Your order is on the way.
      Tracking: UPS [link]
      Expected delivery: June 25"
```

**Example 2: Product question**
```
User: "What size should I order?"
Bot: "Our shirts run true to size. Most customers order their usual size.
      Size chart: [link]
      Need help? Check our sizing guide: [link]"
```

**Example 3: Complex issue**
```
User: "I want to return my order because it doesn't fit"
Bot: "No problem! We offer 30-day returns.
      Return process: [steps]
      Or I can create a support ticket for you.
      Want me to escalate?"
User: "Yes please"
Bot: [Creates support ticket, notifies you]
```

### 4.5 Escalation System

**Simple questions?** AI handles it.
**Complex issues?** Create a support ticket:

```
support_tickets
├─ id (PK)
├─ customer_email
├─ subject
├─ description
├─ status (open, in_progress, resolved)
├─ agent_notes (your internal notes)
├─ created_at
└─ resolved_at
```

You check ticket dashboard, respond directly to customer.

### 4.6 Database Schema: Customer Service

```
chat_conversations
├─ id (PK)
├─ customer_email
├─ platform (discord or website)
├─ messages (json array — [{ role, content, timestamp }, ...])
├─ status (open, resolved, escalated)
├─ created_at
└─ updated_at

support_tickets (see 4.5)

faq
├─ id (PK)
├─ question
├─ answer
├─ category
├─ updated_at
```

---

## 5. System Integration Points

### 5.1 Content Pipeline with All Systems

**Gate 1: Article Submission**
- Scored on 6 dimensions
- If passes threshold → proceeds

**Gate 2: Content Review Enhancement**
- Suggestions to improve
- Re-scored

**Gate 3: Social Post Generation**
- Content approved
- **→ Product recommendations generated**
- Posts include product links

**Gate 4: Video Production**
- Final quality check
- **→ Recommendations in YouTube description**

### 5.2 Customer Interactions

**Customer on website:**
1. Browse merch store
2. View product (includes related articles for context)
3. Have question → chat with AI bot
4. Make purchase → order created
5. Check status → bot provides tracking

**Customer on Discord:**
1. See post with recommended product
2. Click link → opens merch store
3. Have question → DM bot directly
4. Make purchase → same checkout flow

---

## 6. Unified Data Model

### Core Tables

```
news_articles
├─ id, title, content, source_name, source_url
├─ current_quality_score, is_filtered, filter_reason, override_reason
└─ created_at

quality_scores
├─ article_id, 6 scoring dimensions, average_score, meets_threshold
└─ created_at

human_feedback
├─ score_id, decision, notes, changes_made, old/new_scores
└─ created_at

products
├─ id, name, description, category, price, cost, sku, images
├─ stock_count, is_dropship, supplier_id, related_topics
└─ created_at

orders
├─ id, customer_email, customer_address, items (json)
├─ total_price, status, tracking_number
└─ created_at

product_recommendations
├─ article_id, product_id, relevance_score, was_clicked, conversion
└─ created_at

chat_conversations
├─ customer_email, platform, messages (json), status
└─ created_at

support_tickets
├─ customer_email, subject, description, status, agent_notes
└─ created_at
```

---

## 7. Scaling to Team

### Solo Phase (Current)

You handle everything:
- Approve/reject content
- Manage product recommendations
- Pack/ship in-house products
- Respond to support tickets

### Team Phase (Future)

**Possible roles:**

- **Content Editor** — Approves articles, provides feedback to train quality model
- **Product Manager** — Manages catalog, pricing, supplier relationships
- **Fulfillment Lead** — Handles packing, shipping, tracking
- **Community Manager** — Monitors chat feedback, improves FAQ

**Shared dashboards show:**
- Pending content approvals
- Product recommendation accuracy
- Order status & fulfillment
- Support ticket queue
- Chat analytics (volume, satisfaction, common questions)

**No conflicts** — each role owns independent parts.

---

## 8. Implementation Phases

### Phase 1: Quality Scoring (Weeks 1-2)
- 6-dimensional scoring system
- Quality gates & auto-filtering
- Feedback loop for continuous learning

### Phase 2: Merch Store (Weeks 3-4)
- Product database & catalog
- Shopping cart & Stripe checkout
- Order management dashboard

### Phase 3: Product Recommendations (Week 5)
- Recommendation engine
- Integration with content posting (Discord, YouTube, social)
- Click/conversion tracking

### Phase 4: Customer Service Chat (Week 6)
- Ollama chat agent
- Discord bot integration
- Website chat widget
- Ticket escalation system

### Phase 5: Team Readiness (Week 7)
- Multi-user dashboards
- Role-based access
- Knowledge base management
- Fulfillment workflows
- Team onboarding docs

---

## 9. Tech Stack & Costs

| Component | Technology | Cost |
|-----------|-----------|------|
| Content Quality | Ollama (self-hosted) | Free |
| E-Commerce | Node.js + PostgreSQL | Free |
| Chat | Ollama + Discord.js | Free |
| Payments | Stripe | Free tier + 2.9% + $0.30 per transaction |
| Email | Resend | Free tier + volume pricing |
| Hosting | Existing VPS | Already owned |

**Total new startup cost: $0**
**Ongoing cost: ~3% per transaction (Stripe) + email volume**

---

## 10. Success Metrics

### Content Quality
- % of articles filtered (target: 40-70%)
- Model accuracy improving over time
- Override rate: 10-30% (shows AI isn't over-confident)

### Merch Store
- Conversion rate from product recommendations (target: 5-10%)
- Average order value
- Repeat customer rate

### Customer Service
- Chat volume & satisfaction (CSAT score)
- % of chats resolved without escalation (target: 80%+)
- Common questions → FAQ improvements

### Overall
- Customer lifetime value
- Team efficiency (time per order, ticket resolution time)

---

## 11. Rollback Plans

**If quality scoring breaks pipeline:**
1. Disable auto-filtering (all content proceeds)
2. Keep scoring running (for feedback collection)
3. Investigate and adjust thresholds

**If e-commerce goes down:**
1. Chat bot still answers product questions from cached data
2. Orders paused, customers notified
3. Restore from database backup

**If chat bot fails:**
1. Escalate all conversations to support tickets
2. You respond directly until fixed
3. No data loss

---

## 12. Open Questions / TBD

- **Ollama model selection:** Which model for best quality/speed balance? (mistral vs. neural-chat vs. other)
- **Retraining frequency:** Monthly is baseline; faster/slower?
- **Dropship automation:** Will you integrate supplier APIs, or handle manually?
- **Product photography:** Will you shoot originals or use stock photos?
- **Shipping:** Will you partner with a carrier (UPS, FedEx, USPS) or use a fulfillment center?

---

## Summary

This integrated system delivers:

✅ **Quality-focused content** with auto-filtering & continuous AI learning
✅ **Full e-commerce store** (hybrid fulfillment, zero startup cost)
✅ **Automatic product recommendations** in all content
✅ **24/7 AI customer support** on Discord + Website
✅ **Team-ready from day one** (clear role boundaries)
✅ **Metrics to validate** what's working
✅ **Zero startup cost** (Stripe fees only on sales)

Solo operation → Team operation without redesign.
