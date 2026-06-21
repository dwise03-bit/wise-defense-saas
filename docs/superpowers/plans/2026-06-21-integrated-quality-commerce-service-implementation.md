# Integrated Quality-Commerce-Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an integrated ecosystem combining AI content quality scoring, merch e-commerce, product recommendations, and AI customer service chat — all with zero startup cost, designed to scale from solo to team operation.

**Architecture:** Four independent systems with integration points: Content Quality Scoring evaluates articles at 4 gates with human feedback loops; Merch E-Commerce handles products, checkout, and hybrid fulfillment; Product Recommendations bridge content to products via Ollama; AI Customer Service Chat handles support on Discord + website.

**Tech Stack:** Ollama (quality scoring + chat), PostgreSQL (data), Node.js + Express (APIs), Stripe (payments), Resend (email), Discord.js (bot), vanilla JS (chat widget).

## Global Constraints

- Zero startup cost (Stripe fees on transactions only)
- Use existing VPS, PostgreSQL, Ollama instances
- No new dependencies beyond discord.js, stripe, resend (already available)
- Moderate quality thresholds (average score ≥68)
- Monthly retraining cycle for AI models
- All code must be testable without external services (mock Stripe/Ollama)

---

## File Structure

### Phase 1: Quality Scoring

```
dashboard/
├── agents/
│   └── quality-scoring-agent.js       (new)
├── lib/
│   └── quality-scorer.js              (new)
└── db/
    └── migrations/
        └── 001-quality-scoring.sql    (new)
```

### Phase 2: Merch E-Commerce

```
dashboard/
├── lib/
│   └── merch-store.js                 (new)
├── api/
│   ├── products.js                    (new)
│   ├── orders.js                      (new)
│   └── checkout.js                    (new)
└── db/
    └── migrations/
        └── 002-ecommerce.sql          (new)
```

### Phase 3: Product Recommendations

```
dashboard/
├── lib/
│   └── product-recommender.js         (new)
├── api/
│   └── recommendations.js             (new)
└── agents/
    └── recommendation-agent.js        (new)
```

### Phase 4: Customer Service Chat

```
dashboard/
├── lib/
│   ├── chat-agent.js                  (new)
│   └── support-tickets.js             (new)
├── api/
│   ├── chat.js                        (new)
│   ├── support-tickets-api.js         (new)
│   └── faq.js                         (new)
├── agents/
│   └── customer-service-agent.js      (new)
├── public/
│   ├── chat-widget.html               (new)
│   └── chat-widget.js                 (new)
└── db/
    └── migrations/
        └── 003-customer-service.sql   (new)
```

### Phase 5-7: Integration & Team

Integration happens across systems; no new file structure.

---

# Phase 1: Quality Scoring (Weeks 1-2)

## Task 1: Database Schema for Quality Scoring

**Files:**
- Create: `dashboard/db/migrations/001-quality-scoring.sql`
- Create: `dashboard/lib/db-schema.js` (if not exists)

**Interfaces:**
- Produces: SQL tables `quality_scores`, `human_feedback`, modified `news_articles`

- [ ] **Step 1: Write migration file**

Create `dashboard/db/migrations/001-quality-scoring.sql`:

```sql
-- Quality scoring system
CREATE TABLE IF NOT EXISTS quality_scores (
  id SERIAL PRIMARY KEY,
  article_id BIGINT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  gate_number INT NOT NULL,
  relevance_score INT CHECK (relevance_score >= 0 AND relevance_score <= 100),
  credibility_score INT CHECK (credibility_score >= 0 AND credibility_score <= 100),
  engagement_score INT CHECK (engagement_score >= 0 AND engagement_score <= 100),
  brand_alignment_score INT CHECK (brand_alignment_score >= 0 AND brand_alignment_score <= 100),
  fact_check_score INT CHECK (fact_check_score >= 0 AND fact_check_score <= 100),
  uniqueness_score INT CHECK (uniqueness_score >= 0 AND uniqueness_score <= 100),
  average_score NUMERIC(3,2),
  meets_threshold BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(article_id, gate_number)
);

CREATE INDEX idx_quality_scores_article_id ON quality_scores(article_id);
CREATE INDEX idx_quality_scores_meets_threshold ON quality_scores(meets_threshold);

-- Human feedback for training
CREATE TABLE IF NOT EXISTS human_feedback (
  id SERIAL PRIMARY KEY,
  score_id BIGINT NOT NULL REFERENCES quality_scores(id) ON DELETE CASCADE,
  decision VARCHAR(20) NOT NULL CHECK (decision IN ('approve', 'reject', 'modify')),
  notes TEXT,
  changes_made JSONB,
  old_scores JSONB,
  new_scores JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_human_feedback_score_id ON human_feedback(score_id);

-- Modified news_articles table
ALTER TABLE news_articles
  ADD COLUMN IF NOT EXISTS current_quality_score NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS is_filtered BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS filter_reason VARCHAR(255),
  ADD COLUMN IF NOT EXISTS override_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_articles_is_filtered ON news_articles(is_filtered);
```

- [ ] **Step 2: Run migration**

```bash
cd /home/ubuntu/dev/wise-defense-saas/wise-defense-saas/dashboard
docker exec wise-defense-saas-db-1 psql -U postgres -d wisedefense -f /dev/stdin < dashboard/db/migrations/001-quality-scoring.sql
```

Expected: All CREATE TABLE and ALTER TABLE commands complete without error.

- [ ] **Step 3: Verify schema**

```bash
docker exec wise-defense-saas-db-1 psql -U postgres -d wisedefense -c "\d quality_scores"
```

Expected: Table exists with all columns listed above.

- [ ] **Step 4: Commit**

```bash
git add dashboard/db/migrations/001-quality-scoring.sql
git commit -m "feat: add quality scoring database schema"
```

---

## Task 2: Quality Scorer Library

**Files:**
- Create: `dashboard/lib/quality-scorer.js`

**Interfaces:**
- Consumes: Ollama API at `http://localhost:11434/api/generate`
- Produces: `async scoreContent(text, gate) → { relevance: 0-100, credibility: 0-100, engagement: 0-100, brandAlignment: 0-100, factCheck: 0-100, uniqueness: 0-100, averageScore: 0-100, meetsThreshold: boolean }`

- [ ] **Step 1: Create quality-scorer.js**

```javascript
const http = require("http");

class QualityScorer {
  constructor(ollamaUrl = "http://localhost:11434") {
    this.ollamaUrl = ollamaUrl;
  }

  async scoreContent(text, gateNumber = 1) {
    const prompt = `You are a content quality analyzer for Wise Defense, a 2nd Amendment advocacy platform.

Analyze this content on 6 dimensions (score each 0-100):
1. Relevance: How directly does this connect to 2A rights, gun policy, constitutional issues?
2. Credibility: Is the source reputable? Does it cite credible sources?
3. Engagement: Would the audience find this interesting, shareable, discussion-worthy?
4. Brand Alignment: Does tone/messaging match Wise Defense values?
5. Fact-Check: Are claims verifiable? Any misinformation or sensationalism?
6. Uniqueness: Is this new analysis or repackaged content?

Respond with ONLY valid JSON on one line (no markdown, no formatting):
{
  "relevance": <number 0-100>,
  "credibility": <number 0-100>,
  "engagement": <number 0-100>,
  "brandAlignment": <number 0-100>,
  "factCheck": <number 0-100>,
  "uniqueness": <number 0-100>
}

Content to analyze:
${text.substring(0, 1500)}`;

    try {
      const response = await this.callOllama(prompt);
      const scores = JSON.parse(response);

      const average = Math.round(
        (scores.relevance +
          scores.credibility +
          scores.engagement +
          scores.brandAlignment +
          scores.factCheck +
          scores.uniqueness) /
          6
      );

      return {
        relevance: Math.max(0, Math.min(100, scores.relevance)),
        credibility: Math.max(0, Math.min(100, scores.credibility)),
        engagement: Math.max(0, Math.min(100, scores.engagement)),
        brandAlignment: Math.max(0, Math.min(100, scores.brandAlignment)),
        factCheck: Math.max(0, Math.min(100, scores.factCheck)),
        uniqueness: Math.max(0, Math.min(100, scores.uniqueness)),
        averageScore: average,
        meetsThreshold: average >= 68,
      };
    } catch (error) {
      console.error("[QUALITY-SCORER] Error:", error.message);
      throw error;
    }
  }

  async callOllama(prompt) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        model: process.env.OLLAMA_MODEL || "mistral",
        prompt: prompt,
        stream: false,
      });

      const options = {
        hostname: "localhost",
        port: 11434,
        path: "/api/generate",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.response);
          } catch (e) {
            reject(new Error("Invalid Ollama response"));
          }
        });
      });

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }
}

module.exports = QualityScorer;
```

- [ ] **Step 2: Create test file**

Create `dashboard/tests/quality-scorer.test.js`:

```javascript
const QualityScorer = require("../lib/quality-scorer");

describe("QualityScorer", () => {
  let scorer;

  beforeEach(() => {
    scorer = new QualityScorer();
  });

  test("scoreContent returns valid score object", async () => {
    const text = "Second Amendment rights are constitutionally protected freedoms.";
    const scores = await scorer.scoreContent(text);

    expect(scores).toHaveProperty("relevance");
    expect(scores).toHaveProperty("credibility");
    expect(scores).toHaveProperty("engagement");
    expect(scores).toHaveProperty("brandAlignment");
    expect(scores).toHaveProperty("factCheck");
    expect(scores).toHaveProperty("uniqueness");
    expect(scores).toHaveProperty("averageScore");
    expect(scores).toHaveProperty("meetsThreshold");

    expect(scores.averageScore).toBeGreaterThanOrEqual(0);
    expect(scores.averageScore).toBeLessThanOrEqual(100);
    expect(typeof scores.meetsThreshold).toBe("boolean");
  });

  test("meetsThreshold is true when average >= 68", async () => {
    const text = "Important 2A constitutional analysis backed by court decisions and legal scholars.";
    const scores = await scorer.scoreContent(text);
    if (scores.averageScore >= 68) {
      expect(scores.meetsThreshold).toBe(true);
    }
  });
});
```

- [ ] **Step 3: Run tests**

```bash
cd /home/ubuntu/dev/wise-defense-saas/wise-defense-saas/dashboard
npm test -- tests/quality-scorer.test.js
```

Expected: All tests pass (or skip if Ollama not accessible).

- [ ] **Step 4: Commit**

```bash
git add dashboard/lib/quality-scorer.js dashboard/tests/quality-scorer.test.js
git commit -m "feat: implement quality scoring library with 6-dimensional analysis"
```

---

## Task 3: Quality Scoring Agent

**Files:**
- Create: `dashboard/agents/quality-scoring-agent.js`

**Interfaces:**
- Consumes: `QualityScorer`, PostgreSQL `quality_scores` table, `news_articles` table
- Produces: Scores articles at all 4 gates, updates database

- [ ] **Step 1: Create agent**

```javascript
require("dotenv").config();
const pg = require("pg");
const QualityScorer = require("../lib/quality-scorer");

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});

const scorer = new QualityScorer();

async function scoreArticles() {
  try {
    const articles = await pool.query(
      `SELECT id, title, content FROM news_articles 
       WHERE is_filtered IS NULL AND created_at > NOW() - INTERVAL '24 hours'
       ORDER BY created_at DESC
       LIMIT 50`
    );

    for (const article of articles.rows) {
      try {
        const scores = await scorer.scoreContent(article.content, 1);

        await pool.query(
          `INSERT INTO quality_scores 
           (article_id, gate_number, relevance_score, credibility_score, engagement_score, 
            brand_alignment_score, fact_check_score, uniqueness_score, average_score, meets_threshold)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (article_id, gate_number) DO UPDATE SET
             average_score = $9, meets_threshold = $10, updated_at = NOW()`,
          [
            article.id,
            1,
            scores.relevance,
            scores.credibility,
            scores.engagement,
            scores.brandAlignment,
            scores.factCheck,
            scores.uniqueness,
            scores.averageScore,
            scores.meetsThreshold,
          ]
        );

        await pool.query(
          `UPDATE news_articles 
           SET is_filtered = $1, filter_reason = $2, current_quality_score = $3
           WHERE id = $4`,
          [!scores.meetsThreshold, scores.meetsThreshold ? null : "Below quality threshold", scores.averageScore, article.id]
        );

        console.log(`[QUALITY] Article #${article.id}: ${scores.meetsThreshold ? "PASS" : "FAIL"} (${scores.averageScore})`);
      } catch (error) {
        console.error(`[QUALITY] Article #${article.id}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("[QUALITY] Error:", error.message);
  }
}

setInterval(scoreArticles, 3600000); // Every hour
scoreArticles();

process.on("SIGTERM", () => {
  console.log("[QUALITY] Shutting down");
  pool.end();
  process.exit(0);
});
```

- [ ] **Step 2: Add to ecosystem.config.js**

Add this entry to the `apps` array in `dashboard/ecosystem.config.js`:

```javascript
{
  name: "quality-scoring-agent",
  script: "./agents/quality-scoring-agent.js",
  instances: 1,
  exec_mode: "fork",
  env: {
    NODE_ENV: "production",
    DATABASE_URL: process.env.DATABASE_URL,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL || "mistral"
  }
}
```

- [ ] **Step 3: Start agent**

```bash
cd /home/ubuntu/dev/wise-defense-saas/wise-defense-saas/dashboard
pm2 start ecosystem.config.js --only quality-scoring-agent
sleep 2
pm2 logs quality-scoring-agent
```

Expected: Agent logs show "Article #X: PASS/FAIL" entries.

- [ ] **Step 4: Verify database updates**

```bash
docker exec wise-defense-saas-db-1 psql -U postgres -d wisedefense -c "SELECT article_id, average_score, meets_threshold FROM quality_scores LIMIT 5"
```

Expected: Rows appear with scores.

- [ ] **Step 5: Commit**

```bash
git add dashboard/agents/quality-scoring-agent.js dashboard/ecosystem.config.js
git commit -m "feat: implement quality scoring agent that evaluates articles hourly"
```

---

## Task 4: Human Feedback Loop

**Files:**
- Create: `dashboard/lib/feedback-trainer.js`
- Create: `dashboard/api/feedback.js`

**Interfaces:**
- Consumes: Human decisions (approve/reject/modify), existing scores
- Produces: Feedback stored in `human_feedback` table, monthly retraining logs

- [ ] **Step 1: Create feedback trainer**

```javascript
// dashboard/lib/feedback-trainer.js
const pg = require("pg");

class FeedbackTrainer {
  constructor(pool) {
    this.pool = pool;
  }

  async recordDecision(scoreId, decision, notes = "", changesMade = {}, oldScores = {}, newScores = {}) {
    return await this.pool.query(
      `INSERT INTO human_feedback (score_id, decision, notes, changes_made, old_scores, new_scores)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [scoreId, decision, notes, JSON.stringify(changesMade), JSON.stringify(oldScores), JSON.stringify(newScores)]
    );
  }

  async getMonthlyPatterns(months = 1) {
    return await this.pool.query(
      `SELECT 
        COUNT(*) as total_decisions,
        SUM(CASE WHEN decision = 'approve' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN decision = 'reject' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN decision = 'modify' THEN 1 ELSE 0 END) as modified,
        AVG(CAST((new_scores->>'averageScore')::INT AS FLOAT)) as avg_final_score
       FROM human_feedback
       WHERE created_at > NOW() - INTERVAL '${months} months'`
    );
  }

  async getOverrideRate() {
    return await this.pool.query(
      `SELECT 
        COUNT(*) as total_decisions,
        SUM(CASE WHEN old_scores != new_scores THEN 1 ELSE 0 END) as overrides,
        ROUND(100.0 * SUM(CASE WHEN old_scores != new_scores THEN 1 ELSE 0 END) / COUNT(*), 2) as override_percent
       FROM human_feedback`
    );
  }
}

module.exports = FeedbackTrainer;
```

- [ ] **Step 2: Create feedback API**

```javascript
// dashboard/api/feedback.js
const express = require("express");
const pg = require("pg");
const FeedbackTrainer = require("../lib/feedback-trainer");

const router = express.Router();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
const trainer = new FeedbackTrainer(pool);

router.post("/feedback", async (req, res) => {
  const { scoreId, decision, notes, changesMade, oldScores, newScores } = req.body;

  if (!scoreId || !decision) {
    return res.status(400).json({ error: "scoreId and decision required" });
  }

  try {
    const result = await trainer.recordDecision(scoreId, decision, notes, changesMade, oldScores, newScores);
    res.json({ id: result.rows[0].id, created_at: result.rows[0].created_at });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/feedback/patterns", async (req, res) => {
  try {
    const result = await trainer.getMonthlyPatterns();
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/feedback/override-rate", async (req, res) => {
  try {
    const result = await trainer.getOverrideRate();
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

- [ ] **Step 3: Add routes to main app**

In `dashboard/index.js` or `dashboard/app.js`, add:

```javascript
const feedbackRouter = require("./api/feedback");
app.use("/api", feedbackRouter);
```

- [ ] **Step 4: Test feedback recording**

```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "scoreId": 1,
    "decision": "approve",
    "notes": "High quality content",
    "oldScores": {"relevance": 75},
    "newScores": {"relevance": 75}
  }'
```

Expected: Response contains recorded feedback ID and timestamp.

- [ ] **Step 5: Commit**

```bash
git add dashboard/lib/feedback-trainer.js dashboard/api/feedback.js
git commit -m "feat: implement human feedback loop for training AI model"
```

---

# Phase 2: Merch E-Commerce (Weeks 3-4)

## Task 5: E-Commerce Database Schema

**Files:**
- Create: `dashboard/db/migrations/002-ecommerce.sql`

**Interfaces:**
- Produces: `products`, `orders`, `order_items`, `suppliers` tables

- [ ] **Step 1: Create migration**

```sql
-- Merch e-commerce system
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  price NUMERIC(10,2) NOT NULL,
  cost NUMERIC(10,2),
  sku VARCHAR(100) UNIQUE,
  images TEXT[] DEFAULT '{}',
  stock_count INT DEFAULT 0,
  is_dropship BOOLEAN DEFAULT false,
  supplier_id INT,
  related_topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_dropship ON products(is_dropship);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  tracking_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  api_endpoint VARCHAR(500),
  contact_email VARCHAR(255),
  api_key VARCHAR(500)
);
```

- [ ] **Step 2: Run migration**

```bash
docker exec wise-defense-saas-db-1 psql -U postgres -d wisedefense -f /dev/stdin < dashboard/db/migrations/002-ecommerce.sql
```

- [ ] **Step 3: Verify schema**

```bash
docker exec wise-defense-saas-db-1 psql -U postgres -d wisedefense -c "\d products"
```

- [ ] **Step 4: Commit**

```bash
git add dashboard/db/migrations/002-ecommerce.sql
git commit -m "feat: add e-commerce database schema for products and orders"
```

---

## Task 6: Products API

**Files:**
- Create: `dashboard/api/products.js`

**Interfaces:**
- Consumes: `products` table
- Produces: GET `/api/products`, GET `/api/products/:id`, POST `/api/products` (admin)

- [ ] **Step 1: Create products API**

```javascript
// dashboard/api/products.js
const express = require("express");
const pg = require("pg");

const router = express.Router();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });

router.get("/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, category, price, sku, images FROM products ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/products", async (req, res) => {
  const { name, description, category, price, cost, sku, images, stock_count, is_dropship, supplier_id, related_topics } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "name and price required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, category, price, cost, sku, images, stock_count, is_dropship, supplier_id, related_topics)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id`,
      [name, description, category, price, cost, sku, images || [], stock_count || 0, is_dropship || false, supplier_id, related_topics || []]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

- [ ] **Step 2: Add route to main app**

In `dashboard/index.js`, add:

```javascript
const productsRouter = require("./api/products");
app.use("/api", productsRouter);
```

- [ ] **Step 3: Test with sample product**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wise Defense T-Shirt",
    "description": "Premium cotton 2A rights advocacy shirt",
    "category": "apparel",
    "price": 24.99,
    "cost": 8.50,
    "sku": "SHIRT-001",
    "stock_count": 50,
    "related_topics": ["2A", "rights"]
  }'
```

Expected: Returns product ID.

- [ ] **Step 4: Verify product list**

```bash
curl http://localhost:3000/api/products | jq .
```

Expected: Array with the product we just added.

- [ ] **Step 5: Commit**

```bash
git add dashboard/api/products.js
git commit -m "feat: implement products API for catalog management"
```

---

## Task 7: Orders and Checkout API

**Files:**
- Create: `dashboard/api/checkout.js`
- Create: `dashboard/lib/stripe-handler.js`

**Interfaces:**
- Consumes: Stripe API, `products` and `orders` tables
- Produces: POST `/api/checkout` (creates session), POST `/api/checkout/confirm` (confirms payment)

- [ ] **Step 1: Create Stripe handler**

```javascript
// dashboard/lib/stripe-handler.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class StripeHandler {
  async createCheckoutSession(items, customerEmail) {
    const lineItems = items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.STORE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.STORE_URL}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: { items: JSON.stringify(items) },
    });

    return session;
  }

  async retrieveSession(sessionId) {
    return await stripe.checkout.sessions.retrieve(sessionId);
  }
}

module.exports = new StripeHandler();
```

- [ ] **Step 2: Create checkout API**

```javascript
// dashboard/api/checkout.js
const express = require("express");
const pg = require("pg");
const stripeHandler = require("../lib/stripe-handler");

const router = express.Router();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });

router.post("/checkout", async (req, res) => {
  const { items, customerEmail } = req.body;

  if (!items || !customerEmail) {
    return res.status(400).json({ error: "items and customerEmail required" });
  }

  try {
    const session = await stripeHandler.createCheckoutSession(items, customerEmail);
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/checkout/confirm", async (req, res) => {
  const { sessionId, customerAddress } = req.body;

  if (!sessionId || !customerAddress) {
    return res.status(400).json({ error: "sessionId and customerAddress required" });
  }

  try {
    const session = await stripeHandler.retrieveSession(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const items = JSON.parse(session.metadata.items);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderResult = await pool.query(
      `INSERT INTO orders (customer_email, customer_address, items, total_price, status)
       VALUES ($1, $2, $3, $4, 'processing')
       RETURNING id, created_at`,
      [session.customer_email, customerAddress, JSON.stringify(items), totalPrice]
    );

    res.json({ orderId: orderResult.rows[0].id, status: "processing" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

- [ ] **Step 3: Add route to app**

In `dashboard/index.js`, add:

```javascript
const checkoutRouter = require("./api/checkout");
app.use("/api", checkoutRouter);
```

- [ ] **Step 4: Test checkout session creation**

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"name": "T-Shirt", "price": 24.99, "quantity": 1}],
    "customerEmail": "test@example.com"
  }'
```

Expected: Response contains Stripe session ID and checkout URL.

- [ ] **Step 5: Commit**

```bash
git add dashboard/api/checkout.js dashboard/lib/stripe-handler.js
git commit -m "feat: implement Stripe checkout and order confirmation"
```

---

# Phase 3: Product Recommendations (Week 5)

## Task 8: Product Recommendation Engine

**Files:**
- Create: `dashboard/lib/product-recommender.js`
- Create: `dashboard/db/migrations/003-recommendations.sql`

**Interfaces:**
- Consumes: Article content, products table with `related_topics`, Ollama API
- Produces: Recommendations with relevance scores

- [ ] **Step 1: Create migration for recommendations table**

```sql
-- Add to 003-recommendations.sql
CREATE TABLE IF NOT EXISTS product_recommendations (
  id SERIAL PRIMARY KEY,
  article_id BIGINT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  relevance_score INT CHECK (relevance_score >= 0 AND relevance_score <= 100),
  was_clicked BOOLEAN DEFAULT false,
  conversion BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(article_id, product_id)
);

CREATE INDEX idx_recommendations_article_id ON product_recommendations(article_id);
CREATE INDEX idx_recommendations_conversion ON product_recommendations(conversion);
```

- [ ] **Step 2: Run migration**

```bash
docker exec wise-defense-saas-db-1 psql -U postgres -d wisedefense -f /dev/stdin < dashboard/db/migrations/003-recommendations.sql
```

- [ ] **Step 3: Create recommender library**

```javascript
// dashboard/lib/product-recommender.js
const pg = require("pg");
const http = require("http");

class ProductRecommender {
  constructor() {
    this.pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
  }

  async getRecommendations(articleContent, articleId, limit = 3) {
    try {
      // Get all products
      const productsResult = await this.pool.query(
        "SELECT id, name, category, related_topics FROM products"
      );

      const products = productsResult.rows;
      if (products.length === 0) return [];

      // Use Ollama to score relevance
      const scores = await this.scoreProductsAgainstArticle(articleContent, products);

      // Insert recommendations
      for (const { productId, relevance } of scores.slice(0, limit)) {
        try {
          await this.pool.query(
            `INSERT INTO product_recommendations (article_id, product_id, relevance_score)
             VALUES ($1, $2, $3)
             ON CONFLICT (article_id, product_id) DO UPDATE SET relevance_score = $3`,
            [articleId, productId, relevance]
          );
        } catch (e) {
          console.error(`[RECOMMENDER] Failed to save recommendation: ${e.message}`);
        }
      }

      return scores.slice(0, limit);
    } catch (error) {
      console.error("[RECOMMENDER] Error:", error.message);
      return [];
    }
  }

  async scoreProductsAgainstArticle(content, products) {
    const productList = products.map(p => `- ${p.name} (Topics: ${p.related_topics.join(", ")})`).join("\n");

    const prompt = `Score how relevant each product is to this article (0-100).

Article summary (first 500 chars):
${content.substring(0, 500)}

Products:
${productList}

Respond with ONLY valid JSON (one line, no markdown):
{
  "scores": [
    {"name": "Product Name", "relevance": <0-100>},
    ...
  ]
}`;

    try {
      const response = await this.callOllama(prompt);
      const data = JSON.parse(response);

      return data.scores.map(s => ({
        productId: products.find(p => p.name === s.name)?.id,
        relevance: s.relevance,
      })).filter(s => s.productId);
    } catch (error) {
      console.error("[RECOMMENDER] Ollama error:", error.message);
      return [];
    }
  }

  async callOllama(prompt) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        model: process.env.OLLAMA_MODEL || "mistral",
        prompt: prompt,
        stream: false,
      });

      const req = http.request(
        { hostname: "localhost", port: 11434, path: "/api/generate", method: "POST" },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed.response);
            } catch (e) {
              reject(new Error("Invalid Ollama response"));
            }
          });
        }
      );

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }
}

module.exports = ProductRecommender;
```

- [ ] **Step 4: Create recommendations API**

```javascript
// dashboard/api/recommendations.js
const express = require("express");
const pg = require("pg");
const ProductRecommender = require("../lib/product-recommender");

const router = express.Router();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
const recommender = new ProductRecommender();

router.post("/recommendations", async (req, res) => {
  const { articleId } = req.body;

  if (!articleId) {
    return res.status(400).json({ error: "articleId required" });
  }

  try {
    const article = await pool.query("SELECT content FROM news_articles WHERE id = $1", [articleId]);
    if (article.rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    const recommendations = await recommender.getRecommendations(article.rows[0].content, articleId);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/recommendations/:articleId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pr.id, pr.product_id, pr.relevance_score, p.name, p.price
       FROM product_recommendations pr
       JOIN products p ON pr.product_id = p.id
       WHERE pr.article_id = $1
       ORDER BY pr.relevance_score DESC`,
      [req.params.articleId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/recommendations/:id/click", async (req, res) => {
  try {
    await pool.query("UPDATE product_recommendations SET was_clicked = true WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

- [ ] **Step 5: Add route to app**

In `dashboard/index.js`, add:

```javascript
const recommendationsRouter = require("./api/recommendations");
app.use("/api", recommendationsRouter);
```

- [ ] **Step 6: Test recommendations**

```bash
curl -X POST http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"articleId": 1}'
```

Expected: Returns array of recommended products with relevance scores.

- [ ] **Step 7: Commit**

```bash
git add dashboard/lib/product-recommender.js dashboard/api/recommendations.js dashboard/db/migrations/003-recommendations.sql
git commit -m "feat: implement product recommendation engine with Ollama scoring"
```

---

# Phase 4: Customer Service Chat (Week 6)

## Task 9: Chat Agent Database & Library

**Files:**
- Create: `dashboard/lib/chat-agent.js`
- Create: `dashboard/lib/support-tickets.js`

**Interfaces:**
- Consumes: Ollama API, orders table, products table, FAQ data
- Produces: Chat responses, support ticket escalations

- [ ] **Step 1: Create chat agent library**

```javascript
// dashboard/lib/chat-agent.js
const http = require("http");
const pg = require("pg");

class ChatAgent {
  constructor() {
    this.pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
  }

  async chat(message, customerEmail) {
    const context = await this.buildContext(customerEmail);
    const response = await this.callOllama(message, context);
    return response;
  }

  async buildContext(customerEmail) {
    try {
      const orders = await this.pool.query(
        "SELECT id, status, total_price, tracking_number, created_at FROM orders WHERE customer_email = $1 ORDER BY created_at DESC LIMIT 3",
        [customerEmail]
      );

      const ordersText = orders.rows.length > 0
        ? `Customer orders:\n${orders.rows.map(o => `- Order #${o.id}: ${o.status}, $${o.total_price}, tracking: ${o.tracking_number || "N/A"}`).join("\n")}`
        : "No customer history";

      return ordersText;
    } catch (error) {
      console.error("[CHAT] Context error:", error.message);
      return "Unable to load customer history";
    }
  }

  async callOllama(message, context) {
    const prompt = `You are Wise Defense customer support AI. Answer the customer question helpfully.

${context}

Customer message: "${message}"

Respond in 1-2 friendly sentences. If complex, suggest: "I can escalate this to our team. Would you like me to create a support ticket?"`;

    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        model: process.env.OLLAMA_MODEL || "mistral",
        prompt: prompt,
        stream: false,
      });

      const req = http.request(
        { hostname: "localhost", port: 11434, path: "/api/generate", method: "POST" },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed.response);
            } catch (e) {
              reject(new Error("Invalid response"));
            }
          });
        }
      );

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }
}

module.exports = ChatAgent;
```

- [ ] **Step 2: Create support tickets library**

```javascript
// dashboard/lib/support-tickets.js
const pg = require("pg");

class SupportTickets {
  constructor() {
    this.pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: false });
  }

  async createTicket(customerEmail, subject, description) {
    return await this.pool.query(
      `INSERT INTO support_tickets (customer_email, subject, description, status)
       VALUES ($1, $2, $3, 'open')
       RETURNING id, created_at`,
      [customerEmail, subject, description]
    );
  }

  async getTicket(ticketId) {
    return await this.pool.query(
      "SELECT * FROM support_tickets WHERE id = $1",
      [ticketId]
    );
  }

  async updateTicketStatus(ticketId, status, agentNotes = null) {
    return await this.pool.query(
      "UPDATE support_tickets SET status = $1, agent_notes = $2, updated_at = NOW() WHERE id = $3",
      [status, agentNotes, ticketId]
    );
  }

  async listOpenTickets(limit = 50) {
    return await this.pool.query(
      "SELECT id, customer_email, subject, created_at FROM support_tickets WHERE status = 'open' ORDER BY created_at DESC LIMIT $1",
      [limit]
    );
  }
}

module.exports = SupportTickets;
```

- [ ] **Step 3: Commit**

```bash
git add dashboard/lib/chat-agent.js dashboard/lib/support-tickets.js
git commit -m "feat: implement chat agent and support ticket system"
```

---

## Task 10: Chat and Support APIs

**Files:**
- Create: `dashboard/api/chat.js`
- Create: `dashboard/api/support-tickets-api.js`

**Interfaces:**
- Consumes: ChatAgent, SupportTickets
- Produces: POST `/api/chat`, POST `/api/support-tickets`, GET `/api/support-tickets/:id`

- [ ] **Step 1: Create chat API**

```javascript
// dashboard/api/chat.js
const express = require("express");
const ChatAgent = require("../lib/chat-agent");

const router = express.Router();
const chatAgent = new ChatAgent();

router.post("/chat", async (req, res) => {
  const { message, customerEmail } = req.body;

  if (!message || !customerEmail) {
    return res.status(400).json({ error: "message and customerEmail required" });
  }

  try {
    const response = await chatAgent.chat(message, customerEmail);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

- [ ] **Step 2: Create support tickets API**

```javascript
// dashboard/api/support-tickets-api.js
const express = require("express");
const SupportTickets = require("../lib/support-tickets");

const router = express.Router();
const tickets = new SupportTickets();

router.post("/support-tickets", async (req, res) => {
  const { customerEmail, subject, description } = req.body;

  if (!customerEmail || !subject) {
    return res.status(400).json({ error: "customerEmail and subject required" });
  }

  try {
    const result = await tickets.createTicket(customerEmail, subject, description || "");
    res.status(201).json({ id: result.rows[0].id, created_at: result.rows[0].created_at });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/support-tickets/:id", async (req, res) => {
  try {
    const result = await tickets.getTicket(req.params.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/support-tickets", async (req, res) => {
  try {
    const result = await tickets.listOpenTickets();
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

- [ ] **Step 3: Add routes to app**

In `dashboard/