// Reusable ItemForm Component

import Button from "./Button";
import { useState, useEffect } from "react";
const ItemForm = ({ 
  itemType, 
  onSave, 
  existingItem = null, 
  fields, 
  validationRules = {} 
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize form data when component mounts or existingItem changes
  useEffect(() => {
    const initialData = existingItem 
      ? { ...existingItem }
      : fields.reduce((acc, field) => {
          acc[field.name] = '';
          return acc;
        }, {});
    
    setFormData(initialData);
  }, [existingItem, fields]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    
    Object.entries(validationRules).forEach(([field, rules]) => {
      if (rules.required && !formData[field]) {
        newErrors[field] = 'This field is required';
      }
      
      if (rules.minLength && formData[field].length < rules.minLength) {
        newErrors[field] = `Minimum length is ${rules.minLength} characters`;
      }
      
      // Add more validation rules as needed
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{existingItem ? `Edit ${itemType}` : `New ${itemType}`}</h3>
      
      {fields.map((field) => (
        <div key={field.name}>
          <label>
            {field.label}:
            <input
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
            />
            {errors[field.name] && (
              <span style={{ color: 'red' }}>{errors[field.name]}</span>
            )}
          </label>
        </div>
      ))}
      
      <Button 
        type="submit" 
        label={existingItem ? `Update ${itemType}` : `Save ${itemType}`} 
      />
    </form>
  );
};
export default ItemForm;