
import ItemForm from "./ItemForm";
import Button from "./Button";
import React, { useState } from "react";
// Preferences Section Component
const PreferencesSection = ({ 
  customerInfo, 
  onSavePreferences,
  preferencesFields,
  preferencesValidationRules 
}) => {
  const [editingPreferences, setEditingPreferences] = useState(false);

  return (
    <div className="section" id="preferences">
      <h2>Account Preferences</h2>
      
      {editingPreferences ? (
        <ItemForm
          itemType="preferences"
          onSave={(updatedPreferences) => {
            onSavePreferences(updatedPreferences);
            setEditingPreferences(false);
          }}
          fields={preferencesFields}
          validationRules={preferencesValidationRules}
          existingItem={customerInfo}
        />
      ) : (
        <div>
          <p>First Name: {customerInfo?.firstName}</p>
          <p>Last Name: {customerInfo?.lastName}</p>
          <p>Email: {customerInfo?.email}</p>
          <Button 
            type="button" 
            label="Edit Preferences" 
            onClick={() => setEditingPreferences(true)} 
          />
        </div>
      )}
    </div>
  );
};

export default PreferencesSection;