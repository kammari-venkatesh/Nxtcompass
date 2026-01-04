import express from "express"
import { corsConfig } from "./config/cors.js"

import { errorHandler } from "./middlewares/error.middleware.js"

// Routes
import authRoutes from "./routes/auth.routes.js"
import quizRoutes from "./routes/quiz.routes.js"
import predictorRoutes from "./routes/predictor.routes.js"
import collegeRoutes from "./routes/college.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import manifestoRoutes from "./routes/manifesto.routes.js"
import savedCollegesRoutes from "./routes/savedColleges.routes.js"
import predictorResultsRoutes from "./routes/predictorResults.routes.js"

const app = express()

/* =========================
   GLOBAL MIDDLEWARES
========================= */
app.use(corsConfig)
app.use(express.json())

/* =========================
   API ROUTES
========================= */
app.use("/api/auth", authRoutes)
app.use("/api/quiz", quizRoutes)
app.use("/api/predictor", predictorRoutes)
app.use("/api/colleges", collegeRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/manifesto", manifestoRoutes)
app.use("/api/saved-colleges", savedCollegesRoutes)
app.use("/api/predictor-results", predictorResultsRoutes)

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK", service: "NxtCompass API" })
})

/* =========================
   ERROR HANDLER (LAST)
========================= */
app.use(errorHandler)

export default app
