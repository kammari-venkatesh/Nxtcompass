import React from "react"
import "./Button.css"

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  onClick,
  type = "button",
  fullWidth = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? "btn-block" : ""} ${disabled ? "btn-disabled" : ""} ${isLoading ? "btn-loading" : ""} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="btn-spinner"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
