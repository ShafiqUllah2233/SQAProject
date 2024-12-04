import React from 'react';

const Button = ({ type, label, onClick }) => {
  return (
    <button type={type} onClick={onClick} className="btn">
      {label}
    </button>
  );
};

export default Button;
