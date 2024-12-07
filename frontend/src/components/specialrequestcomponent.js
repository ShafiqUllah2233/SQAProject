import React from "react";


//need to improve
const Requestitem=(props)=>{

return(

  <div className="Menuitem">
  <img 
    src={props.imageUrl} 
    alt={props.name + "'s Image"} 
  />
  <h1 style={{ color: '#2980b9' }}>{props.name || "no name"}</h1> {/* Change color of name */}
  <p style={{ color: '#7f8c8d' }}>{props.description || "no description"}</p> {/* Change color of description */}
  <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>
    <strong>$ {props.price || "no price"}/-</strong> {/* Change color of price */}
  </p>
  <p style={{ color: '#2ecc71' }}>{props.category || "no category"}</p> {/* Change color of category */}
</div>


);

};

export default Requestitem;