# NxtCompass API Collection for Postman

**Base URL:** `http://localhost:5000/api`

---

## 1. PREDICTOR API (The one that's failing)

### POST - Predict Colleges
**Endpoint:** `http://localhost:5000/api/predictor`
**Method:** POST
**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "rank": 50000,
  "category": "General",
  "homeState": "Karnataka",
  "preferredBranches": []
}
```

**Expected Response:**
```json
{
  "success": true,
  "count": 2396,
  "results": [
    {
      "collegeId": "695a25a1c482235ccde9545c",
      "branch": "MBBS",
      "cutoffRank": 309000,
      "yourRank": 50000,
      "margin": 259000,
      "probability": 90,
      "label": "HIGH",
      "reason": "You are far ahead of last year cutoff",
      "year": 2025,
      "college": {
        "_id": "695a25a1c482235ccde9545c",
        "name": "College of Medical & Technology, Kochi",
        "state": "Kerala",
        "city": "Kochi",
        "type": "Private",
        "branches": ["MBBS", "BDS"],
        "fees": {
          "general": 145800,
          "obc": 102060,
          "sc": 58320,
          "st": 58320
        }
      }
    }
  ]
}
```

**Test Variations:**

1. **High Rank Test:**
```json
{
  "rank": 1000,
  "category": "General",
  "homeState": "Maharashtra",
  "preferredBranches": ["CSE", "IT"]
}
```

2. **OBC Category Test:**
```json
{
  "rank": 75000,
  "category": "OBC",
  "homeState": "Uttar Pradesh",
  "preferredBranches": []
}
```

3. **SC Category Test:**
```json
{
  "rank": 100000,
  "category": "SC",
  "homeState": "West Bengal",
  "preferredBranches": ["ECE", "EEE"]
}
```

4. **Without Home State:**
```json
{
  "rank": 50000,
  "category": "General",
  "preferredBranches": []
}
```

---

## 2. AUTH APIs

### POST - Register User
**Endpoint:** `http://localhost:5000/api/auth/register`
**Method:** POST

**Request Body:**
```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "Test@1234",
  "phone": "9876543210"
}
```

### POST - Login User
**Endpoint:** `http://localhost:5000/api/auth/login`
**Method:** POST

**Request Body:**
```json
{
  "email": "testuser@example.com",
  "password": "Test@1234"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "testuser@example.com"
  }
}
```

---

## 3. COLLEGE APIs

### GET - Get All Colleges
**Endpoint:** `http://localhost:5000/api/colleges`
**Method:** GET

**Query Parameters (Optional):**
- `page=1`
- `limit=10`
- `state=Karnataka`
- `type=Government`

**Example:**
```
http://localhost:5000/api/colleges?page=1&limit=20&state=Karnataka
```

### GET - Search Colleges
**Endpoint:** `http://localhost:5000/api/colleges/search`
**Method:** GET

**Query Parameters:**
- `q=IIT` (search query)

**Example:**
```
http://localhost:5000/api/colleges/search?q=IIT
```

### GET - Get States List
**Endpoint:** `http://localhost:5000/api/colleges/states`
**Method:** GET

**Response:**
```json
{
  "success": true,
  "states": [
    "Andhra Pradesh",
    "Karnataka",
    "Maharashtra",
    "Tamil Nadu",
    ...
  ]
}
```

### GET - Get College by ID
**Endpoint:** `http://localhost:5000/api/colleges/:collegeId`
**Method:** GET

**Example:**
```
http://localhost:5000/api/colleges/695a25a1c482235ccde9545c
```

### POST - Compare Colleges
**Endpoint:** `http://localhost:5000/api/colleges/compare`
**Method:** POST

**Request Body:**
```json
{
  "collegeIds": [
    "695a25a1c482235ccde9545c",
    "695a25a1c482235ccde9545b"
  ]
}
```

---

## 4. QUIZ APIs

### GET - Get Quiz Questions
**Endpoint:** `http://localhost:5000/api/quiz/questions`
**Method:** GET

### POST - Submit Quiz
**Endpoint:** `http://localhost:5000/api/quiz/submit`
**Method:** POST
**Requires:** Authorization header with Bearer token

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

**Request Body:**
```json
{
  "answers": [
    { "questionId": "q1", "answer": "option1" },
    { "questionId": "q2", "answer": "option3" }
  ]
}
```

---

## 5. CHAT API

### POST - Chat with AI
**Endpoint:** `http://localhost:5000/api/chat`
**Method:** POST

**Request Body:**
```json
{
  "message": "What are the top engineering colleges in India?"
}
```

---

## 6. MANIFESTO API

### POST - Analyze Manifesto
**Endpoint:** `http://localhost:5000/api/manifesto/analyze`
**Method:** POST

**Request Body:**
```json
{
  "manifestoText": "I want to study Computer Science in a top college..."
}
```

---

## 7. HEALTH CHECK

### GET - Health Check
**Endpoint:** `http://localhost:5000/health`
**Method:** GET

**Response:**
```json
{
  "status": "OK",
  "service": "NxtCompass API"
}
```

---

## How to Test in Postman

### Step 1: Test Health Check
```
GET http://localhost:5000/health
```
This should return `{"status": "OK", "service": "NxtCompass API"}`

### Step 2: Test Predictor API (Main Issue)
```
POST http://localhost:5000/api/predictor

Headers:
Content-Type: application/json

Body (raw JSON):
{
  "rank": 50000,
  "category": "General",
  "homeState": "Karnataka",
  "preferredBranches": []
}
```

**Expected:** Should return 2000+ college predictions

### Step 3: Check for Errors
If you get errors, check:
1. **404 Not Found** - Backend server not running
2. **400 Bad Request** - Invalid request body
3. **500 Internal Server Error** - Database or server error
4. **CORS Error** - CORS configuration issue (won't see in Postman, only in browser)

---

## Database Verification Queries

If you want to verify database has data, you can check via MongoDB:

### Check Colleges Count:
```javascript
db.colleges.countDocuments()
// Should return: 309
```

### Check Cutoffs Count:
```javascript
db.cutoffs.countDocuments()
// Should return: 11980
```

### Check Cutoffs for General Category:
```javascript
db.cutoffs.find({ category: "General" }).count()
// Should return: ~1997
```

### Sample Cutoff Document:
```javascript
db.cutoffs.findOne({ category: "General" })
```

---

## Common Issues & Solutions

### Issue 1: "No cutoff data found"
**Cause:** Category mismatch or database not seeded
**Solution:**
- Ensure database is seeded
- Use exact category values: "General", "OBC", "SC", "ST", "EWS", "PwD"

### Issue 2: "Rank and category are required"
**Cause:** Missing required fields in request body
**Solution:** Ensure both `rank` and `category` are present in the request

### Issue 3: Network Error / Connection Refused
**Cause:** Backend server not running
**Solution:** Run `npm run dev` in Backend folder

### Issue 4: Empty results array
**Cause:** No colleges match the criteria
**Solution:** Try with a higher rank (e.g., 50000+) to get more results

---

## Quick Test Script for Postman

You can create a Postman Collection with these tests:

```javascript
// Test 1: Health Check
pm.test("Health check returns OK", function () {
    pm.response.to.have.status(200);
    pm.expect(pm.response.json().status).to.eql("OK");
});

// Test 2: Predictor returns results
pm.test("Predictor returns results", function () {
    pm.response.to.have.status(200);
    pm.expect(pm.response.json().success).to.be.true;
    pm.expect(pm.response.json().count).to.be.above(0);
    pm.expect(pm.response.json().results).to.be.an('array');
});

// Test 3: Results have required fields
pm.test("Results have college details", function () {
    var results = pm.response.json().results;
    pm.expect(results[0]).to.have.property('college');
    pm.expect(results[0]).to.have.property('probability');
    pm.expect(results[0]).to.have.property('branch');
});
```

---

## Category Values (IMPORTANT!)

The backend expects these **exact** category values:
- `General` (not "GENERAL" or "general")
- `EWS` (all caps)
- `OBC` (not "OBC-NCL")
- `SC` (all caps)
- `ST` (all caps)
- `PwD` (not "PWD")

---

## Sample cURL Commands

### Test Health:
```bash
curl http://localhost:5000/health
```

### Test Predictor:
```bash
curl -X POST http://localhost:5000/api/predictor \
  -H "Content-Type: application/json" \
  -d '{"rank": 50000, "category": "General", "homeState": "Karnataka", "preferredBranches": []}'
```

### Test with jq (pretty print):
```bash
curl -X POST http://localhost:5000/api/predictor \
  -H "Content-Type: application/json" \
  -d '{"rank": 50000, "category": "General", "homeState": "Karnataka", "preferredBranches": []}' | jq
```

---

## Troubleshooting Steps

1. **Verify Backend is Running:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Check Database Connection:**
   - Look for "MongoDB connected" in backend console

3. **Verify Data is Seeded:**
   - Check backend console for "309 colleges seeded"
   - Check backend console for "11980 cutoffs seeded"

4. **Test Minimal Request:**
   ```json
   {
     "rank": 50000,
     "category": "General"
   }
   ```

5. **Check Backend Logs:**
   - Look for any error messages in the terminal where backend is running

---

## Expected Backend Console Output

When the predictor API is called successfully:
```
POST /api/predictor 200 - - 450.123 ms
```

When there's an error:
```
POST /api/predictor 400 - - 12.456 ms
POST /api/predictor 500 - - 85.789 ms
```
