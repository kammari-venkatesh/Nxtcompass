import { useState, useEffect } from 'react'
import { getAllColleges } from '../../../services/college.service'
import { getStreamById } from '../constants/streams'
import './CollegeSelectionStep.css'

const CollegeSelectionStep = ({ stream, selectedColleges, onSelectionChange }) => {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    state: '',
    type: '', // Government, Private, Deemed
    city: ''
  })

  const streamInfo = getStreamById(stream)

  useEffect(() => {
    fetchColleges()
  }, [stream, filters])

  const fetchColleges = async () => {
    setLoading(true)
    try {
      const params = {
        page: 1,
        limit: 100,
        state: filters.state || undefined,
        type: filters.type || undefined
      }

      const response = await getAllColleges(params)
      setColleges(response.colleges || [])
    } catch (error) {
      console.error('Error fetching colleges:', error)
      setColleges([])
    } finally {
      setLoading(false)
    }
  }

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = searchQuery === '' ||
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.state?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const handleCollegeToggle = (college) => {
    const isSelected = selectedColleges.some(c => c._id === college._id || c.id === college.id)

    if (isSelected) {
      onSelectionChange(selectedColleges.filter(c => c._id !== college._id && c.id !== college.id))
    } else {
      onSelectionChange([...selectedColleges, college])
    }
  }

  const clearAllSelections = () => {
    onSelectionChange([])
  }

  const uniqueStates = [...new Set(colleges.map(c => c.state).filter(Boolean))]
  const uniqueTypes = [...new Set(colleges.map(c => c.type).filter(Boolean))]

  return (
    <div className="college-selection-step">
      {/* Header Info */}
      <div className="selection-header">
        <div className="stream-badge">
          <span className="badge-icon">{streamInfo?.icon}</span>
          <span className="badge-text">{streamInfo?.name}</span>
        </div>
        <p className="selection-hint">
          Select colleges you're interested in. You can choose multiple colleges to check admission chances.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="college-search-filters">
        <div className="search-box">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search colleges by name, city, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="filter-row">
          <select
            className="filter-select"
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          >
            <option value="">All States</option>
            {uniqueStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {(filters.state || filters.type || searchQuery) && (
            <button
              className="filter-clear-btn"
              onClick={() => {
                setFilters({ state: '', type: '', city: '' })
                setSearchQuery('')
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Selected Count */}
      {selectedColleges.length > 0 && (
        <div className="selection-summary">
          <div className="summary-info">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <span><strong>{selectedColleges.length}</strong> college{selectedColleges.length !== 1 ? 's' : ''} selected</span>
          </div>
          <button className="clear-all-btn" onClick={clearAllSelections}>
            Clear All
          </button>
        </div>
      )}

      {/* Colleges List */}
      <div className="colleges-list">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner-large"></div>
            <p>Loading colleges...</p>
          </div>
        ) : filteredColleges.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <h3>No colleges found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredColleges.map((college) => {
            const isSelected = selectedColleges.some(c => c._id === college._id || c.id === college.id)

            return (
              <div
                key={college._id || college.id}
                className={`college-item ${isSelected ? 'college-item-selected' : ''}`}
                onClick={() => handleCollegeToggle(college)}
              >
                <div className="college-checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="checkbox-custom"></span>
                </div>

                <div className="college-info">
                  <div className="college-header-row">
                    <h4 className="college-name">{college.name}</h4>
                    <span className={`college-type-tag type-${college.type?.toLowerCase()}`}>
                      {college.type}
                    </span>
                  </div>

                  <div className="college-meta">
                    <span className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {college.city}, {college.state}
                    </span>

                    {college.nireRank && (
                      <span className="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        NIRF Rank: {college.nireRank}
                      </span>
                    )}

                    {college.reviews?.rating && (
                      <span className="meta-item">
                        ⭐ {college.reviews.rating}/5
                      </span>
                    )}
                  </div>

                  {college.branches && college.branches.length > 0 && (
                    <div className="college-branches">
                      {college.branches.slice(0, 5).map((branch, idx) => (
                        <span key={idx} className="branch-pill">{branch}</span>
                      ))}
                      {college.branches.length > 5 && (
                        <span className="branch-pill more">+{college.branches.length - 5}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default CollegeSelectionStep
