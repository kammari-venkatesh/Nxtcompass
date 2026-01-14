# 🚀 Zenith AI Mentor - Deployment Guide for Render

## Overview

Your AI Mentor now supports **TWO world-class LLMs** with emotional intelligence:
- **Claude 3.5 Sonnet** (Anthropic) - Best for empathy and emotional support
- **GPT-4o** (OpenAI) - Excellent for technical accuracy and reasoning

The system will **auto-select** the best model based on which API keys you configure!

---

## 🔑 API Keys Required

### Option 1: Claude 3.5 Sonnet (RECOMMENDED for Students)
**Why Claude?** More empathetic, better emotional intelligence, less robotic

1. Go to https://console.anthropic.com/
2. Create account (new users get free credits!)
3. Navigate to **API Keys**
4. Create new key (starts with `sk-ant-`)
5. Copy the key

**Pricing:** $3/million input tokens, $15/million output tokens
**~$0.06 per conversation**

### Option 2: GPT-4o (Alternative)
**Why GPT-4o?** Faster responses, excellent reasoning

1. Go to https://platform.openai.com/
2. Create account ($5 free credits for new users!)
3. Navigate to **API Keys**
4. Create new key (starts with `sk-`)
5. Copy the key

**Pricing:** $2.50/million input tokens, $10/million output tokens
**~$0.05 per conversation**

### Option 3: Both! (ULTIMATE Setup)
Configure both keys and the system will use Claude by default (best empathy) with GPT-4o as fallback.

---

## 📋 Render Deployment Steps

### Step 1: Configure Environment Variables in Render

1. Go to your Render dashboard
2. Select your backend service (e.g., `nxtcompass-backend`)
3. Click **Environment** tab
4. Add these environment variables:

```bash
# For Claude 3.5 Sonnet (RECOMMENDED)
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here

# OR for GPT-4o
OPENAI_API_KEY=sk-your-actual-key-here

# OR BOTH for ultimate setup!

# Optional: Force a specific model
PREFERRED_MODEL=auto  # Options: auto, claude, openai
```

### Step 2: Important Settings

**Auto-Deploy:** Make sure "Auto-Deploy" is enabled
- Every git push will automatically redeploy
- Changes to environment variables require manual redeploy

**Build Command:** Should be
```bash
npm install
```

**Start Command:** Should be
```bash
npm start
```

### Step 3: Save & Redeploy

1. Click **Save Changes**
2. Click **Manual Deploy** → **Deploy latest commit**
3. Wait for deployment to complete (~2-3 minutes)

---

## ✅ Testing Your Deployment

### 1. Check Logs

In Render dashboard, go to **Logs** tab. Look for:

```
✅ SUCCESS: "Claude 3.5 Sonnet service initialized"
   OR
✅ SUCCESS: "OpenAI Agentic RAG service initialized"
```

❌ ERROR: "OpenAI API key not configured" or "Anthropic API key not configured"
→ API key is missing or invalid

### 2. Test in Frontend

Open your deployed frontend, go to AI Mentor, and ask:
```
"I'm confused about which college to choose"
```

**Expected Response with Claude:**
```
I completely understand feeling this way - choosing a college is one 
of the biggest decisions you'll make, and it's totally normal to feel 
overwhelmed. Let me help you break this down...

[Zenith Action Card with Next Steps appears]
```

**Expected Response with GPT-4o:**
```
That's completely valid! Feeling confused about college selection is 
very common. Let me guide you through this step by step...

[Detailed recommendations appear]
```

### 3. Check Browser Console

Open Developer Tools (F12), go to Console. You should see:
```
🔵 [API Request] URL: https://nxtcompass06.onrender.com/api/chat
✅ [API Response] Success: 200 OK
✅ [API Response] Data: {success: true, reply: "...", model: "claude-3.5-sonnet"}
```

---

## 🎯 Features You'll Get

### With Claude 3.5 Sonnet:
✅ **Emotional Analysis** - Detects student's mood before responding
✅ **Validation-First Responses** - Acknowledges feelings before giving advice
✅ **Zenith Action Cards** - Beautiful UI cards with Next 3 Steps
✅ **Auto-Retry** - Friendly retry logic if connection fails
✅ **Micro-Pathing** - Never overwhelms students with too many options
✅ **Inspirational Quotes** - Ends with motivational messages

### With GPT-4o:
✅ **Fast Responses** - Quicker than Claude
✅ **Tool Integration** - Database queries for college data
✅ **Streaming Support** - Real-time response display
✅ **Function Calling** - Advanced prediction tools

### With Both:
✅ **Best of Both Worlds** - Claude for empathy, GPT-4o for complex queries
✅ **Automatic Fallback** - If one fails, uses the other
✅ **Cost Optimization** - Can route simple queries to cheaper model

---

## 💡 Model Selection Guide

### Choose Claude 3.5 Sonnet if:
- Student emotional support is your #1 priority
- You want more human-like, empathetic responses
- Students often feel confused or overwhelmed

### Choose GPT-4o if:
- You need faster response times
- Budget is a concern (slightly cheaper)
- You already have OpenAI setup

### Choose BOTH if:
- You want the ultimate setup
- Automatic fallback is important
- You can afford ~$0.06 per conversation

---

## 🐛 Troubleshooting

### Issue: "I'm having trouble connecting"

**Cause:** No API keys configured in Render

**Fix:**
1. Add `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` to Render environment variables
2. Click "Manual Deploy"
3. Wait for redeployment

### Issue: "My mentor-brain is having trouble"

**Cause:** API key is invalid or quota exceeded

**Fix:**
1. Check API key is correct (no typos)
2. Verify billing is setup on Anthropic/OpenAI dashboard
3. Check usage limits

### Issue: Responses are generic, not empathetic

**Cause:** Using fallback rule-based system (no LLM)

**Fix:**
1. Configure API keys as above
2. Check Render logs for LLM initialization messages

### Issue: CORS errors in browser

**Cause:** Frontend/backend URL mismatch

**Fix:**
- Check `Frontend/src/services/api.js`
- Verify `API_BASE_URL` matches your Render backend URL
- Should be: `https://nxtcompass06.onrender.com/api`

---

## 💰 Cost Estimates

### Claude 3.5 Sonnet
- 100 conversations/day: ~$180/month
- 500 conversations/day: ~$900/month
- **Free Tier:** $5 in credits (~80 conversations)

### GPT-4o
- 100 conversations/day: ~$150/month
- 500 conversations/day: ~$750/month
- **Free Tier:** $5 in credits (~100 conversations)

### Cost Saving Tips:
1. Use Claude for emotional/support queries
2. Use GPT-4o for data-heavy queries
3. Set `max_tokens` lower (1000 instead of 1500)
4. Implement response caching for common questions

---

## 🎓 What Students Will Experience

### Before (No API Key):
```
Student: "I'm confused about colleges"
AI: "I'm having trouble connecting right now."
```

### After (With Claude):
```
Student: "I'm confused about colleges"

AI: "I completely understand feeling this way - choosing a college 
is one of the biggest decisions you'll make, and it's totally normal 
to feel overwhelmed. 💙

Here are your next 3 steps:

📝 1. Share your complete details
   I need your exam name, rank, category, and home state to give 
   you accurate predictions.

🎯 2. Get personalized recommendations
   Once I have your details, I'll show you Safe, Moderate, and 
   Ambitious options with probabilities.

📋 3. Create your preference list
   Start filling your counseling preferences with Safe options 
   first, then Moderate, then Ambitious.

✨ Confusion is the beginning of understanding. Keep asking questions!

💬 Any other questions? I'm here to help with colleges, cutoffs, 
fees, or career advice!"
```

---

## 📊 Performance Monitoring

### In Render Dashboard:

Monitor these metrics:
- **Response Time:** Should be <5 seconds
- **Error Rate:** Should be <1%
- **Memory Usage:** Should stay under 512MB

### In Anthropic/OpenAI Dashboard:

Monitor:
- **Token Usage:** Daily/monthly consumption
- **Costs:** Real-time spend tracking
- **Rate Limits:** Requests per minute

---

## 🔒 Security Best Practices

✅ **DO:**
- Store API keys in Render environment variables (not code)
- Rotate keys every 90 days
- Set usage limits in API dashboards
- Monitor costs daily

❌ **DON'T:**
- Commit API keys to GitHub
- Share keys publicly
- Use keys in frontend code
- Leave unused keys active

---

## 🆘 Emergency Contacts

### Anthropic Support
- Help: https://support.anthropic.com/
- Status: https://status.anthropic.com/
- Docs: https://docs.anthropic.com/

### OpenAI Support
- Help: https://help.openai.com/
- Status: https://status.openai.com/
- Community: https://community.openai.com/

### Render Support
- Help: https://render.com/docs
- Support: support@render.com
- Status: https://status.render.com/

---

## ✨ Next Steps

1. **Add API Key to Render** (5 minutes)
2. **Redeploy Backend** (3 minutes)
3. **Test with Real Queries** (5 minutes)
4. **Monitor Costs** (ongoing)
5. **Celebrate!** 🎉

**Total Setup Time: ~15 minutes**

**Result:** Students get world-class empathetic AI guidance! 💙

---

## 📝 Quick Reference

```bash
# Render Environment Variables (minimum)
ANTHROPIC_API_KEY=sk-ant-your-key  # RECOMMENDED

# OR
OPENAI_API_KEY=sk-your-key  # Alternative

# Optional
PREFERRED_MODEL=auto  # auto|claude|openai
```

**Frontend URL Pattern:**
`https://your-app.onrender.com/api/chat`

**Expected Response Format:**
```json
{
  "success": true,
  "reply": "...",
  "cards": [...],
  "actionCard": {...},
  "emotionalAnalysis": {...},
  "model": "claude-3.5-sonnet" or "gpt-4o"
}
```

---

Your Zenith AI Mentor is now ready to transform students' college selection journey! 🚀🎓
