import React, { useState } from 'react';

const FilterDropdown = ({ setFilterParams }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterValue, setFilterValue] = useState('');

  const categories = ['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE', 'SIDES', 'SPECIALS'];

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleFilterSelect = (filterType) => {
    setSelectedFilter(filterType);
    setDropdownOpen(false);
  };

  const handleCategorySelect = (category) => {
    setFilterValue(category);
    setSelectedFilter(null);
    setFilterParams({ category });
  };

  const handleIngredientsSelect = (ingredients) => {
    setFilterValue(ingredients);
    setSelectedFilter(null);
    setFilterParams({ ingredients: ingredients.split(',').map(i => i.trim()).join(',') });
  };

  const handleSubmitFilter = () => {
    setFilterParams({ [selectedFilter]: filterValue });
    setFilterValue('');
    setSelectedFilter(null);
  };

  return (
    <div className="filter-container">
      <button className="filter-icon" onClick={toggleDropdown}>
        <i className="fas fa-filter"></i> Filter
      </button>

      {isDropdownOpen && (
        <div className="filter-dropdown">
          <ul>
            <li onClick={() => handleFilterSelect('category')}>Filter by Category</li>
            <li onClick={() => handleFilterSelect('price')}>Filter by Price</li>
            <li onClick={() => handleFilterSelect('ingredients')}>Filter by Ingredients</li>
          </ul>
        </div>
      )}

      {/* Category dropdown modal */}
      {selectedFilter === 'category' && (
        <div className="filter-modal">
          <div className="modal-content">
            <h3>Select a category</h3>
            <select onChange={(e) => handleCategorySelect(e.target.value)} value={filterValue}>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button onClick={() => setSelectedFilter(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Ingredients filter modal */}
      {selectedFilter === 'ingredients' && (
        <div className="filter-modal">
          <div className="modal-content">
            <h3>Enter ingredients (comma separated)</h3>
            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="e.g. cheese, tomato"
            />
            <button onClick={() => handleIngredientsSelect(filterValue)}>Apply Filter</button>
            <button onClick={() => setSelectedFilter(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Price range modal (for reference, if needed) */}
      {selectedFilter === 'price' && (
        <div className="filter-modal">
          <div className="modal-content">
            <h3>Enter Price</h3>
            <input
              type="number"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Enter maximum price"
            />
            <button onClick={handleSubmitFilter}>Apply Filter</button>
            <button onClick={() => setSelectedFilter(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
