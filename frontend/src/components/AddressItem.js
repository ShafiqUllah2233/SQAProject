import React from 'react';
import Button from './Button'; // Assuming Button is a reusable component

const AddressItem = ({ address, onEdit, onDelete }) => {
  return (
    <li className="address-item">
      {address.addressLine1}, {address.city}, {address.state}, {address.country}
      <Button type="button" label="Edit" onClick={() => onEdit(address)} />
      <Button type="button" label="Delete" onClick={() => onDelete(address)} />
    </li>
  );
};

export default AddressItem;
