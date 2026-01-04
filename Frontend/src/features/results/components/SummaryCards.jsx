import "../results.css"

const SummaryCards = ({ summary }) => {
  const cards = [
    {
      id: "total",
      label: "Total Matches",
      value: summary.totalMatches,
      icon: "📚",
      color: "cyan",
      description: "colleges within reach",
    },
    {
      id: "high",
      label: "High Chance",
      value: summary.highChance,
      icon: "✅",
      color: "green",
      description: "very likely admission",
    },
    {
      id: "moderate",
      label: "Moderate Chance",
      value: summary.moderateChance,
      icon: "⚡",
      color: "orange",
      description: "good probability",
    },
    {
      id: "ambitious",
      label: "Ambitious",
      value: summary.ambitious,
      icon: "🎯",
      color: "purple",
      description: "stretch goals",
    },
  ]

  return (
    <section className="summary-cards">
      <div className="summary-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`summary-card summary-card--${card.color}`}
          >
            <div className="summary-card-icon">{card.icon}</div>

            <div className="summary-card-content">
              <h3 className="summary-card-label">{card.label}</h3>
              <div className="summary-card-value">{card.value}</div>
              <p className="summary-card-description">{card.description}</p>
            </div>

            <div className="summary-card-accent"></div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SummaryCards
