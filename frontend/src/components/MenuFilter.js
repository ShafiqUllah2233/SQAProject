import React, { useState } from 'react';

const FilterDropdown = ({ setFilterParams }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    ingredients: ''
  });

  const categories = [
    'APPETIZER', 'MAIN_COURSE', 'DESSERT', 
    'BEVERAGE', 'SIDES', 'SPECIALS'
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    const activeFilters = {};

    if (filters.category) {
      activeFilters.category = filters.category;
    }

    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice) activeFilters.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) activeFilters.maxPrice = parseFloat(filters.maxPrice);
    }

    if (filters.ingredients) {
      activeFilters.ingredients = filters.ingredients
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient !== '');
    }

    // Set the filters in the parent component
    setFilterParams(activeFilters);
    setDropdownOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      ingredients: ''
    });
    setFilterParams({}); // Reset the filters in the parent component
    setDropdownOpen(false); // Close the dropdown after reset
  };

  return (
    <div className="filter-container">
      <button 
        className="filter-button"
        onClick={toggleDropdown}
      >
        <i className="fas fa-filter"></i> Filter Menu
      </button>

      {isDropdownOpen && (
        <div className="filter-modal">
          <div className="filter-content">
            <h2 className="filter-title">Filter Menu Items</h2>

            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <label className="filter-label">Price Range</label>
              <div className="filter-price-range">
                <input 
                  type="number" 
                  placeholder="Min Price" 
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="filter-input"
                  min="0"
                />
                <input 
                  type="number" 
                  placeholder="Max Price" 
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="filter-input"
                  min="0"
                />
              </div>
            </div>

            {/* Ingredients Filter */}
            <div className="filter-group">
              <label className="filter-label">Ingredients</label>
              <input 
                type="text" 
                placeholder="Enter ingredients (comma separated)" 
                value={filters.ingredients}
                onChange={(e) => handleFilterChange('ingredients', e.target.value)}
                className="filter-input"
              />
              <small className="filter-tip">
                Tip: Enter multiple ingredients separated by commas
              </small>
            </div>

            {/* Action Buttons */}
            <div className="filter-action-buttons">
              <button 
                onClick={applyFilters}
                className="filter-action-button apply"
              >
                Apply Filters
              </button>
              <button 
                onClick={resetFilters}
                className="filter-action-button reset"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
