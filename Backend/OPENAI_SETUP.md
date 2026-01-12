# 🔑 OpenAI API Setup Guide

## Quick Start

To enable the advanced AI Mentor with GPT-4o, you need an OpenAI API key.

### Step 1: Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (it starts with `sk-`)

⚠️ **Important:** Save this key immediately - you won't be able to see it again!

### Step 2: Add Key to Environment

Create or edit the `.env` file in the `Backend` folder:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here

# Other existing environment variables
MONGODB_URI=...
JWT_SECRET=...
PORT=5000
```

### Step 3: Restart the Backend

```bash
cd Backend
npm run dev
```

You should see in the logs:
```
✓ OpenAI Agentic RAG service initialized
```

### Step 4: Test It

Open the AI Mentor in your app and ask:
```
"Hello! Can you help me find colleges?"
```

If configured correctly, you'll get a warm, detailed response from GPT-4o!

## 💰 Pricing (As of Jan 2026)

### GPT-4o Pricing
- **Input:** $2.50 per 1M tokens
- **Output:** $10.00 per 1M tokens

### Estimated Costs

**Typical Conversation (10 exchanges):**
- Input tokens: ~5,000 tokens
- Output tokens: ~3,000 tokens
- **Cost:** ~$0.05 per conversation

**Monthly Estimates:**
- 100 conversations/day: ~$150/month
- 500 conversations/day: ~$750/month
- 1000 conversations/day: ~$1,500/month

### Cost Optimization Tips

1. **Use gpt-4o-mini for simple queries**
   - Change model in `llm.service.js` to `"gpt-4o-mini"`
   - 15x cheaper: $0.15/$0.60 per 1M tokens
   - Good for basic questions

2. **Implement caching**
   - Cache common questions
   - Reuse tool results when applicable

3. **Set token limits**
   - Already set to 1500 max tokens
   - Can reduce to 1000 for shorter responses

4. **Monitor usage**
   - Check [OpenAI Usage Dashboard](https://platform.openai.com/usage)
   - Set up billing alerts

## 🔒 Security Best Practices

### ✅ DO:
- Store API key in `.env` file
- Add `.env` to `.gitignore`
- Use environment variables
- Rotate keys periodically
- Set usage limits in OpenAI dashboard

### ❌ DON'T:
- Commit API keys to Git
- Share keys publicly
- Use keys in frontend code
- Leave unused keys active

## 🐛 Troubleshooting

### Error: "OpenAI API key not configured"

**Solution:** Check if `.env` file exists and has the key:
```bash
cat Backend/.env | grep OPENAI_API_KEY
```

### Error: "Invalid API key"

**Causes:**
1. Key is incorrect (typo)
2. Key is revoked
3. Key doesn't have permissions

**Solution:** Generate a new key from OpenAI dashboard

### Error: "Rate limit exceeded"

**Causes:**
1. Too many requests per minute
2. Exceeded monthly quota

**Solution:** 
- Upgrade your OpenAI plan
- Implement request throttling
- Add delays between requests

### Error: "Insufficient quota"

**Causes:**
1. Free tier exhausted
2. Payment method issue

**Solution:**
- Add payment method to OpenAI account
- Upgrade to paid tier

## 📊 Monitoring

### Check Backend Logs

```bash
cd Backend
npm run dev
```

Look for:
```
[INFO] OpenAI Agentic RAG service initialized
[INFO] AI Mentor: Processing 2 messages
[INFO] AI Mentor: Calling 1 tool(s)
```

### Check OpenAI Dashboard

Monitor:
- **Usage:** Token consumption
- **Costs:** Daily/monthly spend
- **Errors:** Failed requests
- **Rate limits:** Requests per minute

## 🎛️ Configuration Options

### Model Selection

In `Backend/src/services/llm.service.js`:

```javascript
// Premium quality (recommended for students)
model: "gpt-4o"

// Cost-effective (good for high volume)
model: "gpt-4o-mini"

// Legacy (not recommended)
model: "gpt-4-turbo"
```

### Temperature (Response Creativity)

```javascript
// Current setting (balanced)
temperature: 0.5

// More creative (0.7-1.0)
temperature: 0.7

// More deterministic (0.1-0.3)
temperature: 0.3
```

### Max Tokens (Response Length)

```javascript
// Current setting
max_tokens: 1500

// Shorter responses (save costs)
max_tokens: 1000

// Longer responses (more detail)
max_tokens: 2000
```

## 🆓 Free Tier Alternative

If you want to test without costs:

### Option 1: Use Free Credits
- New OpenAI accounts get $5 free credits
- Enough for ~100 conversations
- Perfect for testing

### Option 2: Use Open-Source Models
- Replace OpenAI with:
  - **Ollama** (local LLMs)
  - **LM Studio** (local GPT-like models)
  - **Groq** (free fast inference)

### Option 3: Rule-Based Fallback
- The app already has rule-based AI counselor
- No API key needed for basic functionality
- Limited to simple queries

## 📞 Support

### OpenAI Issues
- OpenAI Help: https://help.openai.com/
- Status Page: https://status.openai.com/
- Community: https://community.openai.com/

### App Configuration Issues
- Check `Backend/src/services/llm.service.js`
- Verify `.env` file exists and is readable
- Ensure no typos in API key
- Restart backend after changes

## ✅ Checklist

Before deploying to production:

- [ ] API key is set in `.env`
- [ ] `.env` is in `.gitignore`
- [ ] Tested with sample conversations
- [ ] Set usage limits in OpenAI dashboard
- [ ] Configured billing alerts
- [ ] Monitored costs for a week
- [ ] Implemented error handling
- [ ] Added rate limiting (if needed)
- [ ] Documented key rotation process

## 🎉 You're All Set!

Once configured, students will experience:
- ✨ Natural, empathetic conversations
- 🎯 Highly accurate predictions
- 💡 Personalized guidance
- 🚀 Real-time streaming responses

Enjoy the most advanced AI Mentor for college guidance! 🎓
