#!/usr/bin/env node
/**
 * Test Hermes AI Chat Connection
 * Usage: node test-hermes-chat.js
 */

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';

async function testHermesConnection() {
  console.log('\n🧪 Testing Hermes AI Connection...\n');
  console.log(`Ollama URL: ${OLLAMA_URL}`);
  console.log(`Model: ${OLLAMA_MODEL}\n`);

  try {
    console.log('1️⃣  Checking Ollama availability...');
    const healthCheck = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!healthCheck.ok) {
      console.error('❌ Ollama not responding');
      return false;
    }

    const models = await healthCheck.json();
    console.log(`✅ Ollama is running with ${models.models?.length || 0} models`);

    // Check if our model exists
    const modelExists = models.models?.some(m => m.name.includes(OLLAMA_MODEL));
    if (!modelExists) {
      console.warn(`⚠️  Model "${OLLAMA_MODEL}" not found. Available models:`);
      models.models?.forEach(m => console.log(`   - ${m.name}`));
      return false;
    }

    console.log(`✅ Model "${OLLAMA_MODEL}" found\n`);

    console.log('2️⃣  Testing AI chat...');
    const chatResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: 'What is Wise Defense? Answer in 1 sentence.',
        stream: false,
        temperature: 0.7,
        num_predict: 100
      }),
      signal: AbortSignal.timeout(30000)
    });

    if (!chatResponse.ok) {
      console.error(`❌ Chat request failed: ${chatResponse.status}`);
      return false;
    }

    const result = await chatResponse.json();
    const answer = result.response?.trim();

    console.log('✅ Chat response received:');
    console.log(`   "${answer}"\n`);

    console.log('3️⃣  Testing Wise Defense context...');
    const contextResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: `You are a Wise Defense customer service AI. A customer asks: "What is your Pro membership?"`,
        stream: false,
        temperature: 0.7,
        num_predict: 150
      }),
      signal: AbortSignal.timeout(30000)
    });

    if (contextResponse.ok) {
      const contextResult = await contextResponse.json();
      console.log('✅ Context-aware response:');
      console.log(`   "${contextResult.response?.trim()}"\n`);
    }

    console.log('✨ Hermes AI is ready for web chat!\n');
    console.log('📝 Next steps:');
    console.log('   1. Make sure OLLAMA_URL is set in dashboard/.env.local');
    console.log('   2. Rebuild dashboard: docker compose up --build -d dashboard');
    console.log('   3. Test chat at https://academy.wisedefense.store');
    console.log('   4. Click the red chat bubble in bottom right\n');

    return true;
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    console.log('\n📝 Troubleshooting:');
    console.log(`   - Is Ollama running? Start with: ollama serve`);
    console.log(`   - Is Ollama on port 11434?`);
    console.log(`   - Is the model installed? Run: ollama pull ${OLLAMA_MODEL}`);
    console.log(`   - Check OLLAMA_URL env var: ${OLLAMA_URL}\n`);
    return false;
  }
}

testHermesConnection().then(success => {
  process.exit(success ? 0 : 1);
});
