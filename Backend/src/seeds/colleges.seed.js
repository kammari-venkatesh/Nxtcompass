import mongoose from "mongoose"
import College from "../models/College.model.js"
import { ENV } from "../config/env.js"
import logger from "../utils/logger.js"

const config = ENV

// --- DATA SOURCES: REAL NAMES & LOCATIONS ---

const engineeringColleges = [
  { name: "Indian Institute of Technology Madras", city: "Chennai", state: "Tamil Nadu" },
  { name: "Indian Institute of Technology Delhi", city: "New Delhi", state: "Delhi" },
  { name: "Indian Institute of Technology Bombay", city: "Mumbai", state: "Maharashtra" },
  { name: "Indian Institute of Technology Kanpur", city: "Kanpur", state: "Uttar Pradesh" },
  { name: "Indian Institute of Technology Kharagpur", city: "Kharagpur", state: "West Bengal" },
  { name: "Indian Institute of Technology Roorkee", city: "Roorkee", state: "Uttarakhand" },
  { name: "Indian Institute of Technology Guwahati", city: "Guwahati", state: "Assam" },
  { name: "National Institute of Technology Trichy", city: "Tiruchirappalli", state: "Tamil Nadu" },
  { name: "Indian Institute of Technology Hyderabad", city: "Hyderabad", state: "Telangana" },
  { name: "National Institute of Technology Karnataka", city: "Surathkal", state: "Karnataka" },
  { name: "Jadavpur University", city: "Kolkata", state: "West Bengal" },
  { name: "Vellore Institute of Technology", city: "Vellore", state: "Tamil Nadu" },
  { name: "Indian Institute of Technology BHU Varanasi", city: "Varanasi", state: "Uttar Pradesh" },
  { name: "Indian Institute of Technology ISM Dhanbad", city: "Dhanbad", state: "Jharkhand" },
  { name: "National Institute of Technology Rourkela", city: "Rourkela", state: "Odisha" },
  { name: "Indian Institute of Technology Indore", city: "Indore", state: "Madhya Pradesh" },
  { name: "Anna University", city: "Chennai", state: "Tamil Nadu" },
  { name: "Institute of Chemical Technology", city: "Mumbai", state: "Maharashtra" },
  { name: "Amrita Vishwa Vidyapeetham", city: "Coimbatore", state: "Tamil Nadu" },
  { name: "Indian Institute of Technology Mandi", city: "Mandi", state: "Himachal Pradesh" },
  { name: "National Institute of Technology Warangal", city: "Warangal", state: "Telangana" },
  { name: "Indian Institute of Technology Ropar", city: "Ropar", state: "Punjab" },
  { name: "Indian Institute of Technology Gandhinagar", city: "Gandhinagar", state: "Gujarat" },
  { name: "National Institute of Technology Calicut", city: "Kozhikode", state: "Kerala" },
  { name: "Thapar Institute of Engineering and Technology", city: "Patiala", state: "Punjab" },
  { name: "Birla Institute of Technology and Science Pilani", city: "Pilani", state: "Rajasthan" },
  { name: "Indian Institute of Technology Jodhpur", city: "Jodhpur", state: "Rajasthan" },
  { name: "National Institute of Technology Silchar", city: "Silchar", state: "Assam" },
  { name: "Visvesvaraya National Institute of Technology", city: "Nagpur", state: "Maharashtra" },
  { name: "Jamia Millia Islamia", city: "New Delhi", state: "Delhi" },
  { name: "Delhi Technological University", city: "New Delhi", state: "Delhi" },
  { name: "Amity University", city: "Noida", state: "Uttar Pradesh" },
  { name: "Malaviya National Institute of Technology", city: "Jaipur", state: "Rajasthan" },
  { name: "Sri Sivasubramaniya Nadar College of Engineering", city: "Chennai", state: "Tamil Nadu" },
  { name: "Manipal Institute of Technology", city: "Manipal", state: "Karnataka" },
  { name: "National Institute of Technology Kurukshetra", city: "Kurukshetra", state: "Haryana" },
  { name: "Indian Institute of Technology Patna", city: "Patna", state: "Bihar" },
  { name: "Visvesvaraya Technological University", city: "Belagavi", state: "Karnataka" },
  { name: "International Institute of Information Technology Hyderabad", city: "Hyderabad", state: "Telangana" },
  { name: "Motilal Nehru National Institute of Technology", city: "Prayagraj", state: "Uttar Pradesh" },
  { name: "PSG College of Technology", city: "Coimbatore", state: "Tamil Nadu" },
  { name: "National Institute of Technology Durgapur", city: "Durgapur", state: "West Bengal" },
  { name: "Lovely Professional University", city: "Phagwara", state: "Punjab" },
  { name: "University College of Engineering Osmania University", city: "Hyderabad", state: "Telangana" },
  { name: "MS Ramaiah Institute of Technology", city: "Bangalore", state: "Karnataka" },
  { name: "RV College of Engineering", city: "Bangalore", state: "Karnataka" },
  { name: "BMS College of Engineering", city: "Bangalore", state: "Karnataka" },
  { name: "Sardar Vallabhbhai National Institute of Technology", city: "Surat", state: "Gujarat" },
  { name: "National Institute of Technology Meghalaya", city: "Shillong", state: "Meghalaya" },
  { name: "Maulana Azad National Institute of Technology", city: "Bhopal", state: "Madhya Pradesh" }
]

const medicalColleges = [
  { name: "All India Institute of Medical Sciences New Delhi", city: "New Delhi", state: "Delhi" },
  { name: "Post Graduate Institute of Medical Education and Research", city: "Chandigarh", state: "Chandigarh" },
  { name: "Christian Medical College Vellore", city: "Vellore", state: "Tamil Nadu" },
  { name: "National Institute of Mental Health and Neuro Sciences", city: "Bangalore", state: "Karnataka" },
  { name: "Jawaharlal Institute of Postgraduate Medical Education and Research", city: "Puducherry", state: "Puducherry" },
  { name: "Amrita Vishwa Vidyapeetham Medical Sciences", city: "Coimbatore", state: "Tamil Nadu" },
  { name: "Sanjay Gandhi Postgraduate Institute of Medical Sciences", city: "Lucknow", state: "Uttar Pradesh" },
  { name: "Banaras Hindu University Institute of Medical Sciences", city: "Varanasi", state: "Uttar Pradesh" },
  { name: "Kasturba Medical College Manipal", city: "Manipal", state: "Karnataka" },
  { name: "Sree Chitra Tirunal Institute for Medical Sciences", city: "Thiruvananthapuram", state: "Kerala" },
  { name: "Madras Medical College", city: "Chennai", state: "Tamil Nadu" },
  { name: "King George's Medical University", city: "Lucknow", state: "Uttar Pradesh" },
  { name: "All India Institute of Medical Sciences Jodhpur", city: "Jodhpur", state: "Rajasthan" },
  { name: "Vardhman Mahavir Medical College and Safdarjung Hospital", city: "New Delhi", state: "Delhi" },
  { name: "Dr. D. Y. Patil Vidyapeeth", city: "Pune", state: "Maharashtra" },
  { name: "Siksha O Anusandhan Medical", city: "Bhubaneswar", state: "Odisha" },
  { name: "All India Institute of Medical Sciences Bhubaneswar", city: "Bhubaneswar", state: "Odisha" },
  { name: "Saveetha Institute of Medical and Technical Sciences", city: "Chennai", state: "Tamil Nadu" },
  { name: "St. John's Medical College", city: "Bangalore", state: "Karnataka" },
  { name: "SRM Institute of Science and Technology Medical", city: "Chennai", state: "Tamil Nadu" },
  { name: "Sri Ramachandra Institute of Higher Education and Research", city: "Chennai", state: "Tamil Nadu" },
  { name: "All India Institute of Medical Sciences Rishikesh", city: "Rishikesh", state: "Uttarakhand" },
  { name: "Institute of Liver and Biliary Sciences", city: "New Delhi", state: "Delhi" },
  { name: "IPGMER Kolkata", city: "Kolkata", state: "West Bengal" },
  { name: "Datta Meghe Institute of Higher Education", city: "Wardha", state: "Maharashtra" },
  { name: "Kalinga Institute of Industrial Technology Medical", city: "Bhubaneswar", state: "Odisha" },
  { name: "All India Institute of Medical Sciences Patna", city: "Patna", state: "Bihar" },
  { name: "Aligarh Muslim University Medical Faculty", city: "Aligarh", state: "Uttar Pradesh" },
  { name: "Jamia Hamdard", city: "New Delhi", state: "Delhi" },
  { name: "Kasturba Medical College Mangalore", city: "Mangalore", state: "Karnataka" },
  { name: "Lady Hardinge Medical College", city: "New Delhi", state: "Delhi" },
  { name: "Government Medical College and Hospital Chandigarh", city: "Chandigarh", state: "Chandigarh" },
  { name: "Maulana Azad Medical College", city: "New Delhi", state: "Delhi" },
  { name: "Maharishi Markandeshwar University Medical", city: "Ambala", state: "Haryana" },
  { name: "Dayanand Medical College", city: "Ludhiana", state: "Punjab" },
  { name: "University College of Medical Sciences Delhi", city: "New Delhi", state: "Delhi" },
  { name: "JSS Medical College", city: "Mysore", state: "Karnataka" },
  { name: "All India Institute of Medical Sciences Bhopal", city: "Bhopal", state: "Madhya Pradesh" },
  { name: "All India Institute of Medical Sciences Raipur", city: "Raipur", state: "Chhattisgarh" },
  { name: "PSG Institute of Medical Sciences", city: "Coimbatore", state: "Tamil Nadu" },
  { name: "Gujarat Cancer and Research Institute", city: "Ahmedabad", state: "Gujarat" },
  { name: "Christian Medical College Ludhiana", city: "Ludhiana", state: "Punjab" },
  { name: "MS Ramaiah Medical College", city: "Bangalore", state: "Karnataka" },
  { name: "Government Medical College Thiruvananthapuram", city: "Thiruvananthapuram", state: "Kerala" },
  { name: "Medical College Kolkata", city: "Kolkata", state: "West Bengal" },
  { name: "Sawai Man Singh Medical College", city: "Jaipur", state: "Rajasthan" },
  { name: "Mahatma Gandhi Medical College Puducherry", city: "Puducherry", state: "Puducherry" },
  { name: "Chettinad Hospital and Research Institute", city: "Kancheepuram", state: "Tamil Nadu" },
  { name: "Pt. B.D. Sharma PGIMS Rohtak", city: "Rohtak", state: "Haryana" },
  { name: "BJ Medical College Ahmedabad", city: "Ahmedabad", state: "Gujarat" }
]

const managementColleges = [
  { name: "Indian Institute of Management Ahmedabad", city: "Ahmedabad", state: "Gujarat" },
  { name: "Indian Institute of Management Bangalore", city: "Bangalore", state: "Karnataka" },
  { name: "Indian Institute of Management Calcutta", city: "Kolkata", state: "West Bengal" },
  { name: "Indian Institute of Management Kozhikode", city: "Kozhikode", state: "Kerala" },
  { name: "Indian Institute of Technology Delhi DoMS", city: "New Delhi", state: "Delhi" },
  { name: "Indian Institute of Management Lucknow", city: "Lucknow", state: "Uttar Pradesh" },
  { name: "Indian Institute of Management Mumbai", city: "Mumbai", state: "Maharashtra" },
  { name: "Indian Institute of Management Indore", city: "Indore", state: "Madhya Pradesh" },
  { name: "Xavier Labour Relations Institute Jamshedpur", city: "Jamshedpur", state: "Jharkhand" },
  { name: "Indian Institute of Technology Bombay SJMSOM", city: "Mumbai", state: "Maharashtra" },
  { name: "Management Development Institute Gurgaon", city: "Gurgaon", state: "Haryana" },
  { name: "Indian Institute of Technology Kharagpur VGSOM", city: "Kharagpur", state: "West Bengal" },
  { name: "Indian Institute of Management Raipur", city: "Raipur", state: "Chhattisgarh" },
  { name: "Indian Institute of Management Rohtak", city: "Rohtak", state: "Haryana" },
  { name: "Symbiosis Institute of Business Management Pune", city: "Pune", state: "Maharashtra" },
  { name: "Indian Institute of Management Tiruchirappalli", city: "Tiruchirappalli", state: "Tamil Nadu" },
  { name: "Indian Institute of Management Udaipur", city: "Udaipur", state: "Rajasthan" },
  { name: "SP Jain Institute of Management and Research", city: "Mumbai", state: "Maharashtra" },
  { name: "Indian Institute of Management Kashipur", city: "Kashipur", state: "Uttarakhand" },
  { name: "Indian Institute of Management Ranchi", city: "Ranchi", state: "Jharkhand" },
  { name: "Indian Institute of Technology Madras DoMS", city: "Chennai", state: "Tamil Nadu" },
  { name: "Narsee Monjee Institute of Management Studies", city: "Mumbai", state: "Maharashtra" },
  { name: "Indian Institute of Technology Kanpur IME", city: "Kanpur", state: "Uttar Pradesh" },
  { name: "Indian Institute of Foreign Trade", city: "New Delhi", state: "Delhi" },
  { name: "Indian Institute of Management Shillong", city: "Shillong", state: "Meghalaya" },
  { name: "Indian Institute of Technology Roorkee DoMS", city: "Roorkee", state: "Uttarakhand" },
  { name: "Great Lakes Institute of Management", city: "Chennai", state: "Tamil Nadu" },
  { name: "International Management Institute New Delhi", city: "New Delhi", state: "Delhi" },
  { name: "ICFAI Foundation for Higher Education", city: "Hyderabad", state: "Telangana" },
  { name: "Amity University Business School", city: "Noida", state: "Uttar Pradesh" },
  { name: "Lovely Professional University Management", city: "Phagwara", state: "Punjab" },
  { name: "Goa Institute of Management", city: "Sanquelim", state: "Goa" },
  { name: "TA Pai Management Institute", city: "Manipal", state: "Karnataka" },
  { name: "Institute of Management Technology Ghaziabad", city: "Ghaziabad", state: "Uttar Pradesh" },
  { name: "Fore School of Management", city: "New Delhi", state: "Delhi" },
  { name: "Loyola Institute of Business Administration", city: "Chennai", state: "Tamil Nadu" },
  { name: "Nirma University Institute of Management", city: "Ahmedabad", state: "Gujarat" },
  { name: "Kalinga Institute of Industrial Technology Management", city: "Bhubaneswar", state: "Odisha" },
  { name: "Birla Institute of Management Technology", city: "Greater Noida", state: "Uttar Pradesh" },
  { name: "Chandigarh University Business School", city: "Mohali", state: "Punjab" },
  { name: "Prin. L. N. Welingkar Institute of Management", city: "Mumbai", state: "Maharashtra" },
  { name: "Banaras Hindu University Management", city: "Varanasi", state: "Uttar Pradesh" },
  { name: "Institute of Rural Management Anand", city: "Anand", state: "Gujarat" },
  { name: "UPES School of Business", city: "Dehradun", state: "Uttarakhand" },
  { name: "Jaipuria Institute of Management", city: "Noida", state: "Uttar Pradesh" },
  { name: "Alliance University School of Business", city: "Bangalore", state: "Karnataka" },
  { name: "BML Munjal University School of Management", city: "Gurgaon", state: "Haryana" },
  { name: "Xavier Institute of Management Bhubaneswar", city: "Bhubaneswar", state: "Odisha" },
  { name: "KJ Somaiya Institute of Management", city: "Mumbai", state: "Maharashtra" },
  { name: "Faculty of Management Studies Delhi", city: "New Delhi", state: "Delhi" }
]

const lawColleges = [
  { name: "National Law School of India University", city: "Bangalore", state: "Karnataka" },
  { name: "National Law University Delhi", city: "New Delhi", state: "Delhi" },
  { name: "NALSAR University of Law", city: "Hyderabad", state: "Telangana" },
  { name: "West Bengal National University of Juridical Sciences", city: "Kolkata", state: "West Bengal" },
  { name: "Jamia Millia Islamia Faculty of Law", city: "New Delhi", state: "Delhi" },
  { name: "Symbiosis Law School Pune", city: "Pune", state: "Maharashtra" },
  { name: "Gujarat National Law University", city: "Gandhinagar", state: "Gujarat" },
  { name: "Siksha O Anusandhan Law", city: "Bhubaneswar", state: "Odisha" },
  { name: "Indian Institute of Technology Kharagpur RGSOIPL", city: "Kharagpur", state: "West Bengal" },
  { name: "Babasaheb Bhimrao Ambedkar University", city: "Lucknow", state: "Uttar Pradesh" },
  { name: "Saveetha School of Law", city: "Chennai", state: "Tamil Nadu" },
  { name: "Kalinga Institute of Industrial Technology Law", city: "Bhubaneswar", state: "Odisha" },
  { name: "Christ University School of Law", city: "Bangalore", state: "Karnataka" },
  { name: "Aligarh Muslim University Faculty of Law", city: "Aligarh", state: "Uttar Pradesh" },
  { name: "SASTRA Deemed University School of Law", city: "Thanjavur", state: "Tamil Nadu" },
  { name: "Lovely Professional University School of Law", city: "Phagwara", state: "Punjab" },
  { name: "National Law University Jodhpur", city: "Jodhpur", state: "Rajasthan" },
  { name: "Symbiosis Law School Noida", city: "Noida", state: "Uttar Pradesh" },
  { name: "Guru Gobind Singh Indraprastha University Law", city: "New Delhi", state: "Delhi" },
  { name: "Dr. Ram Manohar Lohiya National Law University", city: "Lucknow", state: "Uttar Pradesh" },
  { name: "Rajiv Gandhi National University of Law", city: "Patiala", state: "Punjab" },
  { name: "National Law Institute University Bhopal", city: "Bhopal", state: "Madhya Pradesh" },
  { name: "National University of Advanced Legal Studies", city: "Kochi", state: "Kerala" },
  { name: "National Law University Odisha", city: "Cuttack", state: "Odisha" },
  { name: "National University of Study and Research in Law", city: "Ranchi", state: "Jharkhand" },
  { name: "Hidayatullah National Law University", city: "Raipur", state: "Chhattisgarh" },
  { name: "Chanakya National Law University", city: "Patna", state: "Bihar" },
  { name: "Damodaram Sanjivayya National Law University", city: "Visakhapatnam", state: "Andhra Pradesh" },
  { name: "Maharashtra National Law University Mumbai", city: "Mumbai", state: "Maharashtra" },
  { name: "Maharashtra National Law University Nagpur", city: "Nagpur", state: "Maharashtra" },
  { name: "Tamil Nadu National Law University", city: "Tiruchirappalli", state: "Tamil Nadu" },
  { name: "Maharashtra National Law University Aurangabad", city: "Aurangabad", state: "Maharashtra" },
  { name: "Himachal Pradesh National Law University", city: "Shimla", state: "Himachal Pradesh" },
  { name: "Dharmashastra National Law University", city: "Jabalpur", state: "Madhya Pradesh" },
  { name: "Dr. B.R. Ambedkar National Law University", city: "Sonepat", state: "Haryana" },
  { name: "National Law University and Judicial Academy Assam", city: "Guwahati", state: "Assam" },
  { name: "National Law University Tripura", city: "Agartala", state: "Tripura" },
  { name: "UPES School of Law", city: "Dehradun", state: "Uttarakhand" },
  { name: "Jindal Global Law School", city: "Sonipat", state: "Haryana" },
  { name: "Army Institute of Law", city: "Mohali", state: "Punjab" },
  { name: "ILS Law College", city: "Pune", state: "Maharashtra" },
  { name: "Government Law College Mumbai", city: "Mumbai", state: "Maharashtra" },
  { name: "Faculty of Law University of Delhi", city: "New Delhi", state: "Delhi" },
  { name: "Bangalore Institute of Legal Studies", city: "Bangalore", state: "Karnataka" },
  { name: "KLE Society Law College", city: "Bangalore", state: "Karnataka" },
  { name: "MS Ramaiah College of Law", city: "Bangalore", state: "Karnataka" },
  { name: "Amity Law School Noida", city: "Noida", state: "Uttar Pradesh" },
  { name: "ICFAI Law School Hyderabad", city: "Hyderabad", state: "Telangana" },
  { name: "Alliance School of Law", city: "Bangalore", state: "Karnataka" },
  { name: "Vivekananda Institute of Professional Studies", city: "New Delhi", state: "Delhi" }
]

const designColleges = [
  { name: "National Institute of Design Ahmedabad", city: "Ahmedabad", state: "Gujarat" },
  { name: "National Institute of Fashion Technology Delhi", city: "New Delhi", state: "Delhi" },
  { name: "Indian Institute of Technology Bombay IDC School of Design", city: "Mumbai", state: "Maharashtra" },
  { name: "National Institute of Fashion Technology Mumbai", city: "Mumbai", state: "Maharashtra" },
  { name: "National Institute of Fashion Technology Bangalore", city: "Bangalore", state: "Karnataka" },
  { name: "Indian Institute of Technology Delhi Department of Design", city: "New Delhi", state: "Delhi" },
  { name: "National Institute of Design Bangalore", city: "Bangalore", state: "Karnataka" },
  { name: "National Institute of Fashion Technology Chennai", city: "Chennai", state: "Tamil Nadu" },
  { name: "Indian Institute of Technology Guwahati Department of Design", city: "Guwahati", state: "Assam" },
  { name: "National Institute of Fashion Technology Hyderabad", city: "Hyderabad", state: "Telangana" },
  { name: "National Institute of Design Gandhinagar", city: "Gandhinagar", state: "Gujarat" },
  { name: "Indian Institute of Technology Hyderabad Department of Design", city: "Hyderabad", state: "Telangana" },
  { name: "National Institute of Fashion Technology Kolkata", city: "Kolkata", state: "West Bengal" },
  { name: "Indian Institute of Technology Kanpur Department of Design", city: "Kanpur", state: "Uttar Pradesh" },
  { name: "IIITDM Jabalpur Design Discipline", city: "Jabalpur", state: "Madhya Pradesh" },
  { name: "National Institute of Fashion Technology Gandhinagar", city: "Gandhinagar", state: "Gujarat" },
  { name: "Symbiosis Institute of Design", city: "Pune", state: "Maharashtra" },
  { name: "National Institute of Design Haryana", city: "Kurukshetra", state: "Haryana" },
  { name: "National Institute of Design Madhya Pradesh", city: "Bhopal", state: "Madhya Pradesh" },
  { name: "National Institute of Design Andhra Pradesh", city: "Amaravati", state: "Andhra Pradesh" },
  { name: "National Institute of Design Assam", city: "Jorhat", state: "Assam" },
  { name: "Footwear Design and Development Institute", city: "Noida", state: "Uttar Pradesh" },
  { name: "Army Institute of Fashion and Design", city: "Bangalore", state: "Karnataka" },
  { name: "MIT Institute of Design", city: "Pune", state: "Maharashtra" },
  { name: "Srishti Manipal Institute of Art Design and Technology", city: "Bangalore", state: "Karnataka" },
  { name: "Pearl Academy Delhi", city: "New Delhi", state: "Delhi" },
  { name: "Pearl Academy Mumbai", city: "Mumbai", state: "Maharashtra" },
  { name: "Vogue Institute of Art and Design", city: "Bangalore", state: "Karnataka" },
  { name: "World University of Design", city: "Sonepat", state: "Haryana" },
  { name: "UPES School of Design", city: "Dehradun", state: "Uttarakhand" },
  { name: "Lovely Professional University School of Design", city: "Phagwara", state: "Punjab" },
  { name: "Amity School of Fashion Technology", city: "Noida", state: "Uttar Pradesh" },
  { name: "JD Institute of Fashion Technology", city: "Bangalore", state: "Karnataka" },
  { name: "Arch College of Design and Business", city: "Jaipur", state: "Rajasthan" },
  { name: "The Design Village", city: "Noida", state: "Uttar Pradesh" },
  { name: "Whistling Woods International", city: "Mumbai", state: "Maharashtra" },
  { name: "Unitedworld Institute of Design", city: "Gandhinagar", state: "Gujarat" },
  { name: "Anant National University", city: "Ahmedabad", state: "Gujarat" },
  { name: "GLS Institute of Design", city: "Ahmedabad", state: "Gujarat" },
  { name: "ITM Institute of Design and Media", city: "Mumbai", state: "Maharashtra" },
  { name: "Indian Institute of Art and Design", city: "New Delhi", state: "Delhi" },
  { name: "ISDI School of Design and Innovation", city: "Mumbai", state: "Maharashtra" },
  { name: "DJ Academy of Design", city: "Coimbatore", state: "Tamil Nadu" },
  { name: "Maeers MIT Institute of Design", city: "Pune", state: "Maharashtra" },
  { name: "Karnavati University School of Design", city: "Gandhinagar", state: "Gujarat" },
  { name: "Parul University School of Design", city: "Vadodara", state: "Gujarat" },
  { name: "Chitkara School of Art and Design", city: "Chandigarh", state: "Chandigarh" },
  { name: "VIT School of Design", city: "Vellore", state: "Tamil Nadu" },
  { name: "Jain University School of Design", city: "Bangalore", state: "Karnataka" },
  { name: "Woxsen University School of Arts and Design", city: "Hyderabad", state: "Telangana" }
]

// --- HELPER FUNCTIONS ---

const generateAcronym = (name, index) => {
  // Generate acronym from college name
  const words = name.split(" ")
  let acronym = ""

  if (name.includes("Indian Institute of Technology")) {
    const city = words[words.length - 1]
    acronym = "IIT-" + city.substring(0, 3).toUpperCase()
  } else if (name.includes("Indian Institute of Management")) {
    const city = words[words.length - 1]
    acronym = "IIM-" + city.substring(0, 3).toUpperCase()
  } else if (name.includes("National Institute of Technology")) {
    const city = words[words.length - 1]
    acronym = "NIT-" + city.substring(0, 3).toUpperCase()
  } else if (name.includes("National Institute of Design")) {
    const location = words[words.length - 1]
    acronym = "NID-" + location.substring(0, 3).toUpperCase()
  } else if (name.includes("National Institute of Fashion Technology")) {
    const location = words[words.length - 1]
    acronym = "NIFT-" + location.substring(0, 3).toUpperCase()
  } else if (name.includes("All India Institute of Medical Sciences")) {
    const city = words[words.length - 1]
    acronym = "AIIMS-" + city.substring(0, 3).toUpperCase()
  } else {
    // Take first letter of each significant word
    acronym = words
      .filter(w => w.length > 2 && !["of", "and", "the", "for"].includes(w.toLowerCase()))
      .map(w => w[0])
      .join("")
      .substring(0, 6)
      .toUpperCase()
  }

  return acronym + "-" + (index + 1)
}

const getBranchesForStream = (streamType) => {
  switch (streamType) {
    case "Engineering":
      return ["CSE", "ECE", "MECH", "CIVIL", "EEE", "IT", "CHEM", "AERO"]
    case "Medical":
      return ["MBBS", "BDS", "BAMS", "BHMS", "Nursing", "Pharmacy"]
    case "Management":
      return ["MBA", "PGDM", "BBA", "Executive MBA"]
    case "Law":
      return ["BA LLB", "BBA LLB", "B.Com LLB", "LLM", "3-Year LLB"]
    case "Design":
      return ["B.Des", "M.Des", "Fashion Design", "Product Design", "Communication Design", "Interior Design"]
    default:
      return []
  }
}

const getFeesForStream = (streamType, isGovernment) => {
  const baseFees = {
    Engineering: { general: isGovernment ? 150000 : 400000 },
    Medical: { general: isGovernment ? 50000 : 1500000 },
    Management: { general: isGovernment ? 200000 : 1800000 },
    Law: { general: isGovernment ? 30000 : 300000 },
    Design: { general: isGovernment ? 100000 : 500000 }
  }

  const base = baseFees[streamType] || { general: 100000 }
  return {
    general: base.general,
    obc: Math.round(base.general * 0.7),
    sc: Math.round(base.general * 0.3),
    st: Math.round(base.general * 0.3)
  }
}

const createCollegeObject = (collegeData, rank, streamType) => {
  const isGovernment = rank < 25 ||
    collegeData.name.includes("Indian Institute") ||
    collegeData.name.includes("National") ||
    collegeData.name.includes("Government") ||
    collegeData.name.includes("AIIMS")

  const type = isGovernment ? "Government" : (rank < 35 ? "Deemed" : "Private")
  const branches = getBranchesForStream(streamType)
  const selectedBranches = branches.slice(0, 3 + Math.floor(Math.random() * 3))

  return {
    name: collegeData.name,
    acronym: generateAcronym(collegeData.name, rank),
    state: collegeData.state,
    city: collegeData.city,
    type: type,
    nireRank: rank + 1,
    website: `www.${collegeData.name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 15)}.ac.in`,
    contactEmail: `admissions@${collegeData.name.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 10)}.ac.in`,
    contactPhone: `+91-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    branches: selectedBranches,
    fees: getFeesForStream(streamType, isGovernment),
    totalSeats: 100 + Math.floor(Math.random() * 900),
    reviews: {
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      count: Math.floor(50 + Math.random() * 500)
    },
    isActive: true
  }
}

// --- MAIN SEED FUNCTION ---

const seedColleges = async () => {
  try {
    await mongoose.connect(config.MONGO_URI)
    logger.info("Connected to MongoDB")

    // Clear existing data
    await College.deleteMany({})
    logger.info("Cleared existing colleges")

    // Generate all college objects
    const allColleges = [
      ...engineeringColleges.map((c, i) => createCollegeObject(c, i, "Engineering")),
      ...medicalColleges.map((c, i) => createCollegeObject(c, i, "Medical")),
      ...managementColleges.map((c, i) => createCollegeObject(c, i, "Management")),
      ...lawColleges.map((c, i) => createCollegeObject(c, i, "Law")),
      ...designColleges.map((c, i) => createCollegeObject(c, i, "Design"))
    ]

    // Insert all colleges
    const result = await College.insertMany(allColleges)
    logger.info(`Successfully seeded ${result.length} colleges across 5 streams:`)
    logger.info(`  - Engineering: 50 colleges`)
    logger.info(`  - Medical: 50 colleges`)
    logger.info(`  - Management: 50 colleges`)
    logger.info(`  - Law: 50 colleges`)
    logger.info(`  - Design: 50 colleges`)

    await mongoose.disconnect()
    logger.info("Disconnected from MongoDB")
  } catch (error) {
    logger.error("Seeding error:", error.message)
    process.exit(1)
  }
}

seedColleges()
