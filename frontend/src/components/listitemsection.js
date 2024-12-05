import Button from "./Button";

const ListItemSection = ({
  title,
  items,
  itemRenderer,
  onEdit,
  onDelete,
  addButtonLabel,
  onAddNew,
  isAddingNew,
  formComponent: FormComponent,
  formProps
}) => {
  return (
    <div className="section">
      <h2>{title}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {itemRenderer(item)}
            <Button 
              type="button" 
              label="Edit" 
              onClick={() => onEdit(item)} 
            />
            <Button 
              type="button" 
              label="Delete" 
              onClick={() => onDelete(item)} 
            />
          </li>
        ))}
      </ul>
      
      {isAddingNew && FormComponent && (
        <FormComponent {...formProps} />
      )}
      
      {!isAddingNew && (
        <Button 
          type="button" 
          label={addButtonLabel} 
          onClick={onAddNew} 
        />
      )}
    </div>
  );
};


export default ListItemSection;