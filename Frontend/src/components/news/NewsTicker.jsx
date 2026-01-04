import { useState, useRef, useEffect } from "react"
import "./NewsTicker.css"

const newsItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&h=120&fit=crop",
    headline: "JEE Main 2026 Registration Opens",
    meta: "2 hours ago • Exam Alert",
    link: "#"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&h=120&fit=crop",
    headline: "IIT Bombay Announces New AI Course",
    meta: "5 hours ago • Campus News",
    link: "#"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=120&h=120&fit=crop",
    headline: "NEET UG 2026 Exam Pattern Updated",
    meta: "1 day ago • Important Update",
    link: "#"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=120&h=120&fit=crop",
    headline: "Top 10 NITs for Computer Science",
    meta: "1 day ago • Rankings",
    link: "#"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=120&h=120&fit=crop",
    headline: "New Scholarship Programs Announced",
    meta: "2 days ago • Opportunities",
    link: "#"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=120&h=120&fit=crop",
    headline: "JoSAA Counseling Dates Released",
    meta: "3 days ago • Admission",
    link: "#"
  }
]

const NewsTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const scrollContainerRef = useRef(null)

  const itemsPerView = 4
  const totalItems = newsItems.length

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - itemsPerView : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= totalItems - itemsPerView ? 0 : prev + 1))
  }

  // Auto-scroll functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        handleNext()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [currentIndex, isHovered])

  return (
    <section className="news-ticker-section">
      <div className="news-ticker-container glass">
        {/* Header */}
        <div className="news-ticker-header">
          <span className="news-ticker-icon">🚀</span>
          <h3 className="news-ticker-title">Trending Now</h3>
        </div>

        {/* Navigation - Left Arrow */}
        <button
          className="news-nav-btn news-nav-prev glass-hover"
          onClick={handlePrevious}
          aria-label="Previous news"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* News Items */}
        <div
          className="news-ticker-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={scrollContainerRef}
        >
          <div
            className="news-ticker-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {newsItems.map((item, index) => (
              <a
                key={item.id}
                href={item.link}
                className="news-item"
                style={{ "--item-index": index }}
              >
                <div className="news-item-image">
                  <img src={item.image} alt={item.headline} />
                </div>
                <div className="news-item-content">
                  <h4 className="news-item-headline">{item.headline}</h4>
                  <p className="news-item-meta">{item.meta}</p>
                </div>
                {index < newsItems.length - 1 && <div className="news-divider" />}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation - Right Arrow */}
        <button
          className="news-nav-btn news-nav-next glass-hover"
          onClick={handleNext}
          aria-label="Next news"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default NewsTicker
