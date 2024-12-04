import React from 'react';

const Input = ({ type, name, placeholder, value, onChange, required }) => {
  return (
    <div className="input-container">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="input"
      />
    </div>
  );
};

export default Input;
