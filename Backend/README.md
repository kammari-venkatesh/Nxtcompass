# NxtCompass Backend

AI-powered college guidance platform backend. Provides APIs for quiz analysis, college prediction, and AI-assisted counseling.

## Project Structure

```
src/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── config/                # Configuration files
│   ├── db.js              # MongoDB connection
│   ├── env.js             # Environment variables
│   └── cors.js            # CORS configuration
├── models/                # Mongoose schemas
│   ├── User.model.js      # User schema
│   ├── College.model.js   # College data schema
│   ├── Exam.model.js      # Exam information schema
│   ├── Cutoff.model.js    # Cutoff data schema
│   ├── QuizQuestion.model.js
│   └── QuizResult.model.js
├── controllers/           # Request handlers
│   ├── auth.controller.js
│   ├── quiz.controller.js
│   ├── predictor.controller.js
│   ├── college.controller.js
│   └── chat.controller.js
├── routes/                # API routes
│   ├── auth.routes.js
│   ├── quiz.routes.js
│   ├── predictor.routes.js
│   ├── college.routes.js
│   └── chat.routes.js
├── services/              # Business logic
│   ├── quizEngine.js      # Trait-based scoring
│   ├── predictorEngine.js # College prediction
│   ├── cutoffAnalyzer.js  # Cutoff analysis
│   └── ai.service.js      # LLM integration
├── middlewares/           # Express middlewares
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validate.middleware.js
├── utils/                 # Utility functions
│   ├── logger.js
│   ├── response.js
│   └── cache.js
└── seeds/                 # Database seeders
    ├── colleges.seed.js
    ├── cutoffs.seed.js
    └── exams.seed.js
```

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB 5+
- npm or yarn

### Installation

```bash
cd Backend
npm install
```

### Environment Setup

Create a `.env` file:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nxtcompass
JWT_SECRET=your_jwt_secret_key_change_in_production
CORS_ORIGIN=http://localhost:5173
OPENAI_API_KEY=sk-your-api-key-here
```

### Database Setup

Start MongoDB:

```bash
mongod
```

Seed the database:

```bash
npm run seed
```

### Running the Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server will be available at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Quiz

- `POST /api/quiz/submit` - Submit quiz results (protected)
- `GET /api/quiz/history` - Get quiz history (protected)
- `GET /api/quiz/:quizId` - Get specific quiz result (protected)

### Predictor

- `POST /api/predictor/predict` - Predict colleges
- `GET /api/predictor/cutoffs` - Get cutoff data
- `POST /api/predictor/compare` - Compare colleges (protected)

### Colleges

- `GET /api/colleges` - Get all colleges with pagination
- `GET /api/colleges/search` - Search colleges
- `GET /api/colleges/states` - Get all states
- `GET /api/colleges/:collegeId` - Get college details

### Chat

- `POST /api/chat/message` - Send message to AI counselor (protected)
- `GET /api/chat/history` - Get chat history (protected)
- `DELETE /api/chat/history` - Clear chat history (protected)

## Features

### Trait-Based Quiz Engine

Analyzes user responses to identify:
- Logic & reasoning
- Problem-solving ability
- Tech interest
- Hands-on skills
- Creativity
- Mathematical aptitude
- Analytical thinking

Maps traits to 5 branches: CSE, ECE, IT, MECH, CIVIL

### College Predictor

Converts percentile/rank to college predictions based on:
- Exam type
- Candidate rank/percentile
- Category (General, OBC, SC, ST, EWS, PwD)
- Home state
- Optional preferences (branch, budget, locations)

### AI Counselor

Provides personalized guidance:
- College recommendations
- Cutoff trend analysis
- Fee comparisons
- Branch-specific insights
- Career path guidance

## Error Handling

All errors follow standardized response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (dev only)"
}
```

## Logging

Logs are output to console with levels:
- error
- warn
- info
- debug

Set `LOG_LEVEL` in `.env` to control verbosity

## Caching

In-memory cache for colleges and cutoff data.

**Production Note**: Replace with Redis for distributed caching.

## TODO

- [ ] Integrate OpenAI API for chat
- [ ] Implement college matching algorithm
- [ ] Add cutoff prediction ML model
- [ ] Implement user preferences system
- [ ] Add admin panel for data management
- [ ] Setup production database
- [ ] Add rate limiting
- [ ] Add email notifications
- [ ] Implement analytics

## License

MIT
