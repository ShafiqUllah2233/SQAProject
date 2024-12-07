import React from 'react';
import '../index.css';

const Cartitem = ({
  
  imageUrl, 
  name, 
  quantity, 
  price, 
  description, 
  category, 
  onQuantityIncrease, 
  onQuantityDecrease, 
  onDelete
}) => {
  return (
    <div className="cartitem">
      <div className="cartitem-img">
        <img 
          src={imageUrl}
          alt={name + "'s Image"} 
        />
        <div className="cartitem-details">
          <h1 
            className="cartitem-name" 
            style={{ color: '#2C3E50' }}
          >
            {name || 'No Name'}
          </h1> 
          <p 
            className="cartitem-description" 
            style={{ color: '#7F8C8D' }}
          >
            {description || 'No Description'}
          </p>
          <p 
            className="cartitem-category" 
            style={{ color: '#E74C3C' }}
          >
            Category: {category || 'Uncategorized'}
          </p>
          
          {/* Quantity Control */}
          <div className="quantity-control" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <button 
              onClick={onQuantityDecrease}
              style={{ 
                backgroundColor: '#E74C3C', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '5px',
                cursor: 'pointer' 
              }}
            >
              -
            </button>
            <p 
              className="cartitem-quantity" 
              style={{ color: '#27AE60', margin: '0 10px' }}
            >
              Quantity: {quantity || '0'}
            </p>
            <button 
              onClick={onQuantityIncrease}
              style={{ 
                backgroundColor: '#27AE60', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '5px' ,
                cursor: 'pointer'
              }}
            >
              +
            </button>
          </div>
          
          <p 
            className="cartitem-price" 
            style={{ color: '#F39C12' }}
          >
            Price: ${price ? price.toFixed(2) : '0.00'}
          </p>
          
          {/* Delete Button */}
          <button 
            onClick={onDelete}
            style={{ 
              backgroundColor: '#E74C3C', 
              color: 'white', 
              border: 'none', 
              padding: '5px 10px', 
              borderRadius: '5px', 
              marginTop: '10px' ,
              cursor:'pointer'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cartitem;