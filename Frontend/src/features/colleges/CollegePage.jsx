import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../../components/navigation/Navbar"
import Button from "../../components/ui/Button"
import "./CollegePage.css"

const CollegePage = () => {
  const { collegeId } = useParams()
  const navigate = useNavigate()

  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5000/api/colleges/${collegeId}`)
        const data = await response.json()

        if (data.success) {
          setCollege(data.data)
        } else {
          setError("College not found")
        }
      } catch (err) {
        setError("Failed to load college details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCollege()
  }, [collegeId])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="college-page">
          <div className="college-loading">
            <div className="spinner"></div>
            <p>Loading college details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !college) {
    return (
      <>
        <Navbar />
        <div className="college-page">
          <div className="college-error">
            <h1>College Not Found</h1>
            <p>{error || "The college you're looking for doesn't exist."}</p>
            <Button variant="primary" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="college-page">
        <div className="college-container">
          {/* Header Section */}
          <div className="college-header">
            <div className="college-header-content">
              <div className="college-badge">{college.acronym}</div>
              <h1 className="college-name">{college.name}</h1>
              <p className="college-location">
                📍 {college.city}, {college.state}
              </p>
              <div className="college-meta">
                <span className="meta-item">
                  {college.type} Institution
                </span>
                {college.nireRank && (
                  <span className="meta-item">
                    NIRF Rank: #{college.nireRank}
                  </span>
                )}
                <span className="meta-item">
                  {college.totalSeats} Seats
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="college-tabs">
            <button
              className={`tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === "fees" ? "active" : ""}`}
              onClick={() => setActiveTab("fees")}
            >
              Fees
            </button>
            <button
              className={`tab ${activeTab === "branches" ? "active" : ""}`}
              onClick={() => setActiveTab("branches")}
            >
              Branches
            </button>
            <button
              className={`tab ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              Contact
            </button>
          </div>

          {/* Tab Content */}
          <div className="college-content">
            {activeTab === "overview" && (
              <div className="tab-panel">
                <div className="info-grid">
                  <div className="info-card">
                    <div className="info-icon">🎓</div>
                    <div className="info-content">
                      <h3>Institution Type</h3>
                      <p>{college.type}</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">🏆</div>
                    <div className="info-content">
                      <h3>NIRF Ranking</h3>
                      <p>{college.nireRank ? `#${college.nireRank}` : "Not Available"}</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">👥</div>
                    <div className="info-content">
                      <h3>Total Seats</h3>
                      <p>{college.totalSeats || "N/A"}</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">📚</div>
                    <div className="info-content">
                      <h3>Branches Offered</h3>
                      <p>{college.branches?.length || 0} Programs</p>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h2>About</h2>
                  <p className="college-description">
                    {college.name} is a {college.type.toLowerCase()} institution located in {college.city}, {college.state}.
                    {college.nireRank && ` Ranked #${college.nireRank} in NIRF rankings,`} it offers undergraduate
                    programs across {college.branches?.length || 0} branches with a total capacity of {college.totalSeats} students.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "fees" && (
              <div className="tab-panel">
                <h2>Fee Structure</h2>
                <div className="fees-grid">
                  <div className="fee-card">
                    <div className="fee-category">General</div>
                    <div className="fee-amount">₹{college.fees?.general?.toLocaleString() || "N/A"}</div>
                    <div className="fee-label">Per Year</div>
                  </div>

                  <div className="fee-card">
                    <div className="fee-category">OBC</div>
                    <div className="fee-amount">₹{college.fees?.obc?.toLocaleString() || "N/A"}</div>
                    <div className="fee-label">Per Year</div>
                  </div>

                  <div className="fee-card">
                    <div className="fee-category">SC</div>
                    <div className="fee-amount">₹{college.fees?.sc?.toLocaleString() || "N/A"}</div>
                    <div className="fee-label">Per Year</div>
                  </div>

                  <div className="fee-card">
                    <div className="fee-category">ST</div>
                    <div className="fee-amount">₹{college.fees?.st?.toLocaleString() || "N/A"}</div>
                    <div className="fee-label">Per Year</div>
                  </div>
                </div>
                <p className="fee-note">
                  * Fees are subject to change. Please verify from official college website.
                </p>
              </div>
            )}

            {activeTab === "branches" && (
              <div className="tab-panel">
                <h2>Available Branches</h2>
                <div className="branches-grid">
                  {college.branches?.map((branch) => (
                    <div key={branch} className="branch-card">
                      <div className="branch-icon">🎓</div>
                      <div className="branch-name">{branch}</div>
                    </div>
                  ))}
                </div>
                {(!college.branches || college.branches.length === 0) && (
                  <p className="empty-state">No branch information available</p>
                )}
              </div>
            )}

            {activeTab === "contact" && (
              <div className="tab-panel">
                <h2>Contact Information</h2>
                <div className="contact-grid">
                  <div className="contact-card">
                    <div className="contact-icon">🌐</div>
                    <div className="contact-content">
                      <h3>Website</h3>
                      <a href={`https://${college.website}`} target="_blank" rel="noopener noreferrer">
                        {college.website}
                      </a>
                    </div>
                  </div>

                  <div className="contact-card">
                    <div className="contact-icon">📧</div>
                    <div className="contact-content">
                      <h3>Email</h3>
                      <a href={`mailto:${college.contactEmail}`}>
                        {college.contactEmail}
                      </a>
                    </div>
                  </div>

                  {college.contactPhone && (
                    <div className="contact-card">
                      <div className="contact-icon">📞</div>
                      <div className="contact-content">
                        <h3>Phone</h3>
                        <p>{college.contactPhone}</p>
                      </div>
                    </div>
                  )}

                  <div className="contact-card">
                    <div className="contact-icon">📍</div>
                    <div className="contact-content">
                      <h3>Location</h3>
                      <p>{college.city}, {college.state}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="college-actions">
            <Button variant="primary" size="lg" onClick={() => navigate("/predictor")}>
              Check Your Chances
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate("/chat")}>
              Ask AI Counselor
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}

export default CollegePage
