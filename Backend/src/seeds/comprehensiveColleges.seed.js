import mongoose from "mongoose"
import College from "../models/College.model.js"
import { ENV } from "../config/env.js"
import logger from "../utils/logger.js"

const config = ENV

// ========================================
// COMPREHENSIVE COLLEGE DATA GENERATOR
// Generates 300+ realistic colleges across India
// ========================================

const STREAMS = ["Engineering", "Medical", "MBA", "Law", "Design"]
const TIERS = {
  PREMIER: { label: "Premier", baseCutoff: 5000, fees: { govt: 25000, private: 350000 }, avgPackage: "18 LPA" },
  EXCELLENT: { label: "Excellent", baseCutoff: 15000, fees: { govt: 40000, private: 280000 }, avgPackage: "12 LPA" },
  GOOD: { label: "Good", baseCutoff: 35000, fees: { govt: 50000, private: 220000 }, avgPackage: "8 LPA" },
  AVERAGE: { label: "Average", baseCutoff: 70000, fees: { govt: 60000, private: 180000 }, avgPackage: "5 LPA" },
  DECENT: { label: "Decent", baseCutoff: 120000, fees: { govt: 70000, private: 150000 }, avgPackage: "3.5 LPA" }
}

const CITIES = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Kakinada"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam"],
  "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Delhi": ["Delhi"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida"],
  "West Bengal": ["Kolkata", "Durgapur", "Siliguri", "Asansol"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Udaipur"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"]
}

const ENGINEERING_BRANCHES = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "CHEM", "AI-ML", "BIO"]
const MEDICAL_BRANCHES = ["MBBS", "BDS", "BAMS", "BHMS"]
const MBA_BRANCHES = ["MBA-General", "MBA-Finance", "MBA-Marketing", "MBA-HR"]

const COLLEGE_TYPES = {
  IIT: { prefix: "Indian Institute of Technology", nireRange: [1, 23], type: "Government", tier: "PREMIER" },
  NIT: { prefix: "National Institute of Technology", nireRange: [24, 54], type: "Government", tier: "EXCELLENT" },
  IIIT: { prefix: "Indian Institute of Information Technology", nireRange: [55, 85], type: "Government", tier: "EXCELLENT" },
  DEEMED: { prefix: "Deemed University", nireRange: [86, 150], type: "Deemed", tier: "GOOD" },
  STATE_GOVT: { prefix: "Government College of", nireRange: [151, 250], type: "Government", tier: "GOOD" },
  PRIVATE_TOP: { prefix: "Institute of", nireRange: [251, 400], type: "Private", tier: "AVERAGE" },
  PRIVATE_MID: { prefix: "College of", nireRange: [401, 600], type: "Private", tier: "DECENT" }
}

function generateCollegeName(collegeType, stream, city, index) {
  const typeConfig = COLLEGE_TYPES[collegeType]

  if (collegeType === "IIT") {
    return `Indian Institute of Technology ${city}`
  } else if (collegeType === "NIT") {
    return `National Institute of Technology ${city}`
  } else if (collegeType === "IIIT") {
    return `Indian Institute of Information Technology ${city}`
  } else if (collegeType === "DEEMED") {
    const names = ["Vellore Institute of Technology", "Manipal Institute of Technology", "SRM Institute of Science and Technology", "KIIT University"]
    return names[index % names.length]
  } else if (collegeType === "STATE_GOVT") {
    return `${typeConfig.prefix} ${stream}, ${city}`
  } else {
    return `${typeConfig.prefix} ${stream} & Technology, ${city}`
  }
}

function generateAcronym(name) {
  const words = name.split(" ")
  if (words.length === 1) return name.substring(0, 3).toUpperCase()

  return words
    .filter(word => word.length > 2 && !["of", "and", "the", "for"].includes(word.toLowerCase()))
    .map(word => word[0])
    .join("")
    .substring(0, 6)
    .toUpperCase()
}

function getBranchesForStream(stream) {
  if (stream === "Engineering") return ENGINEERING_BRANCHES
  if (stream === "Medical") return MEDICAL_BRANCHES.slice(0, 2) // MBBS, BDS
  if (stream === "MBA") return MBA_BRANCHES
  return ["General"]
}

function generateFees(tier, type) {
  const tierConfig = TIERS[tier]
  const baseFee = type === "Government" ? tierConfig.fees.govt : tierConfig.fees.private

  // Add some variance
  const variance = baseFee * 0.15
  const actualFee = baseFee + (Math.random() * variance - variance / 2)

  return {
    general: Math.round(actualFee),
    obc: Math.round(actualFee * 0.7),
    sc: Math.round(actualFee * 0.4),
    st: Math.round(actualFee * 0.4),
    ews: Math.round(actualFee * 0.6)
  }
}

function generateWebsite(acronym) {
  return `www.${acronym.toLowerCase()}.ac.in`
}

function generateTotalSeats(tier, type) {
  const base = {
    PREMIER: 800,
    EXCELLENT: 600,
    GOOD: 500,
    AVERAGE: 400,
    DECENT: 300
  }

  const seatCount = base[tier] || 400
  const variance = seatCount * 0.2
  return Math.round(seatCount + (Math.random() * variance - variance / 2))
}

function generateColleges() {
  const colleges = []
  let collegeId = 1
  let nireRank = 1

  // Generate colleges for each type
  Object.entries(COLLEGE_TYPES).forEach(([collegeTypeKey, config]) => {
    const count = collegeTypeKey === "IIT" ? 23 :
                  collegeTypeKey === "NIT" ? 31 :
                  collegeTypeKey === "IIIT" ? 25 :
                  collegeTypeKey === "DEEMED" ? 40 :
                  collegeTypeKey === "STATE_GOVT" ? 80 :
                  collegeTypeKey === "PRIVATE_TOP" ? 60 :
                  collegeTypeKey === "PRIVATE_MID" ? 50 : 10

    for (let i = 0; i < count; i++) {
      // Pick random state and city
      const states = Object.keys(CITIES)
      const randomState = states[Math.floor(Math.random() * states.length)]
      const cities = CITIES[randomState]
      const randomCity = cities[Math.floor(Math.random() * cities.length)]

      // Determine stream (Engineering dominant)
      let stream = "Engineering"
      const streamRoll = Math.random()
      if (streamRoll > 0.8) stream = "Medical"
      else if (streamRoll > 0.9) stream = "MBA"

      const name = generateCollegeName(collegeTypeKey, stream, randomCity, i)
      const acronym = generateAcronym(name)
      const branches = getBranchesForStream(stream)
      const fees = generateFees(config.tier, config.type)
      const totalSeats = generateTotalSeats(config.tier, config.type)

      colleges.push({
        name,
        acronym,
        state: randomState,
        city: randomCity,
        type: config.type,
        nireRank: nireRank++,
        website: generateWebsite(acronym),
        contactEmail: `admissions@${acronym.toLowerCase()}.ac.in`,
        contactPhone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        branches,
        fees,
        totalSeats,
        reviews: {
          rating: +(3.5 + Math.random() * 1.5).toFixed(1),
          count: Math.floor(Math.random() * 1000) + 100
        },
        isActive: true
      })

      collegeId++
    }
  })

  return colleges
}

const seedComprehensiveColleges = async () => {
  try {
    await mongoose.connect(config.MONGO_URI)
    logger.info("🔌 Connected to MongoDB")

    await College.deleteMany({})
    logger.info("🗑️  Cleared existing colleges")

    const colleges = generateColleges()
    const result = await College.insertMany(colleges)

    logger.info(`✅ Successfully seeded ${result.length} colleges`)
    logger.info(`   - IIT: 23`)
    logger.info(`   - NIT: 31`)
    logger.info(`   - IIIT: 25`)
    logger.info(`   - Deemed: 40`)
    logger.info(`   - State Government: 80`)
    logger.info(`   - Private (Top Tier): 60`)
    logger.info(`   - Private (Mid Tier): 50`)
    logger.info(`   Total: ${result.length} colleges across ${Object.keys(CITIES).length} states`)

    await mongoose.disconnect()
    logger.info("🔌 Disconnected from MongoDB")
  } catch (error) {
    logger.error("❌ Seeding error:", error.message)
    process.exit(1)
  }
}

seedComprehensiveColleges()
