import React, { useId } from "react"
import "./Input.css"

const Input = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  disabled = false,
  required = false,
  size = "md",
  icon,
  iconPosition = "left",
  helpText,
  maxLength,
  className = "",
  ...props
}) => {
  const inputId = useId()
  const hasError = error && error.length > 0
  const hasSuccess = success && !hasError

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className={`input-wrapper ${hasError ? "input-error" : ""} ${hasSuccess ? "input-success" : ""}`}>
        {icon && iconPosition === "left" && (
          <span className="input-icon input-icon-left">{icon}</span>
        )}

        <input
          id={inputId}
          type={type}
          className={`input input-${size}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          maxLength={maxLength}
          {...props}
        />

        {icon && iconPosition === "right" && (
          <span className="input-icon input-icon-right">{icon}</span>
        )}
      </div>

      {error && <span className="input-error-text">{error}</span>}
      {helpText && !error && <span className="input-help-text">{helpText}</span>}
      {maxLength && (
        <span className="input-counter">
          {value?.length || 0} / {maxLength}
        </span>
      )}
    </div>
  )
}

export default Input
