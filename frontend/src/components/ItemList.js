// ItemList.js
import React from 'react';
import Button from './Button'; // Reuse the existing Button component

const ItemList = ({ items, onEdit, onDelete, itemType }) => {
  return (
    <ul>
      {items.length > 0 ? (
        items.map((item, index) => (
          <li key={index}>
            {itemType === 'address'
              ? `${item.addressLine1}, ${item.city}, ${item.state}, ${item.country}`
              : `${item.cardNumber} - ${item.cardHolderName}`}
            <Button type="button" label="Edit" onClick={() => onEdit(item)} />
            <Button type="button" label="Delete" onClick={() => onDelete(item)} />
          </li>
        ))
      ) : (
        <p>No {itemType}s found.</p>
      )}
    </ul>
  );
};

export default ItemList;
