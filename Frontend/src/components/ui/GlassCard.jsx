import React from "react"
import "./GlassCard.css"

const GlassCard = ({
  children,
  className = "",
  hover = true,
  onClick,
}) => {
  return (
    <div
      className={`glass-card ${hover ? "glass-hover" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default GlassCard
