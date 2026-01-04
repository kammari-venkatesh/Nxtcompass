import mongoose from "mongoose"
import College from "../models/College.model.js"
import { ENV } from "../config/env.js"
import logger from "../utils/logger.js"

const config = ENV

const COLLEGES_DATA = [
  {
    name: "Indian Institute of Technology Bombay",
    acronym: "IIT-B",
    state: "Maharashtra",
    city: "Mumbai",
    type: "Government",
    nireRank: 3,
    website: "www.iitb.ac.in",
    contactEmail: "admissions@iitb.ac.in",
    branches: ["CSE", "ECE", "MECH", "CIVIL", "IT"],
    fees: {
      general: 20000,
      obc: 10000,
      sc: 5000,
      st: 5000,
    },
    totalSeats: 600,
  },
  {
    name: "Indian Institute of Technology Delhi",
    acronym: "IIT-D",
    state: "Delhi",
    city: "Delhi",
    type: "Government",
    nireRank: 2,
    website: "www.iitd.ac.in",
    contactEmail: "admissions@iitd.ac.in",
    branches: ["CSE", "ECE", "MECH", "CIVIL"],
    fees: {
      general: 20000,
      obc: 10000,
      sc: 5000,
      st: 5000,
    },
    totalSeats: 550,
  },
  {
    name: "Indian Institute of Technology Madras",
    acronym: "IIT-M",
    state: "Tamil Nadu",
    city: "Chennai",
    type: "Government",
    nireRank: 4,
    website: "www.iitm.ac.in",
    contactEmail: "admissions@iitm.ac.in",
    branches: ["CSE", "ECE", "MECH", "CIVIL", "IT"],
    fees: {
      general: 20000,
      obc: 10000,
      sc: 5000,
      st: 5000,
    },
    totalSeats: 600,
  },
  {
    name: "BITS Pilani",
    acronym: "BITS-P",
    state: "Rajasthan",
    city: "Pilani",
    type: "Private",
    nireRank: 18,
    website: "www.bits-pilani.ac.in",
    contactEmail: "admissions@bits-pilani.ac.in",
    branches: ["CSE", "ECE", "MECH"],
    fees: {
      general: 800000,
      obc: 750000,
      sc: 700000,
      st: 700000,
    },
    totalSeats: 500,
  },
  {
    name: "Delhi Technological University",
    acronym: "DTU",
    state: "Delhi",
    city: "Delhi",
    type: "Government",
    nireRank: 34,
    website: "www.dtu.ac.in",
    contactEmail: "admissions@dtu.ac.in",
    branches: ["CSE", "ECE", "MECH", "CIVIL"],
    fees: {
      general: 50000,
      obc: 30000,
      sc: 15000,
      st: 15000,
    },
    totalSeats: 700,
  },
]

const seedColleges = async () => {
  try {
    await mongoose.connect(config.MONGO_URI)
    logger.info("Connected to MongoDB")

    await College.deleteMany({})
    logger.info("Cleared existing colleges")

    const result = await College.insertMany(COLLEGES_DATA)
    logger.info(`Seeded ${result.length} colleges`)

    await mongoose.disconnect()
    logger.info("Disconnected from MongoDB")
  } catch (error) {
    logger.error("Seeding error:", error.message)
    process.exit(1)
  }
}

seedColleges()
