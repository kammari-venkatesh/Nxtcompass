import GlassCard from "../../../components/ui/GlassCard"
import "./ExamStep.css"

const exams = [
  { id: "jee-main", label: "JEE Main" },
  { id: "jee-adv", label: "JEE Advanced" },
  { id: "neet", label: "NEET" },
  { id: "bitsat", label: "BITSAT" },
  { id: "viteee", label: "VITEEE" },
  { id: "eamcet", label: "EAMCET" },
]

const ExamStep = ({ selectedExam, onSelect }) => {
  return (
    <div>
      <h2>Select Your Entrance Exam</h2>

      <div className="exam-grid">
        {exams.map((exam) => (
          <GlassCard
            key={exam.id}
            className={`exam-card ${
              selectedExam === exam.id ? "active" : ""
            }`}
            onClick={() => onSelect(exam.id)}
          >
            {exam.label}
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

export default ExamStep
