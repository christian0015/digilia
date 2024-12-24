import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { nanoid } from "nanoid";


const AddHeaders = () => {
  const [headers, setHeaders] = useState([]);

  // Charger les composants depuis le localStorage
  const storedComponents = JSON.parse(localStorage.getItem('components')) || [];
  const storedSelectedComponent = JSON.parse(localStorage.getItem('selectedComponent'));

  const [components, setComponents] = useState(storedComponents);
  const [selectedComponent, setSelectedComponent] = useState(storedSelectedComponent);

  useEffect(() => {
  // Sauvegarder dans localStorage
  localStorage.setItem('components', JSON.stringify(components));
  console.log("Add Send Component:",components);
  }, [components, selectedComponent]);


  const handleAddHeader = (headerTemplate) => {
    setComponents((prevHeaders) => [...prevHeaders, { ...headerTemplate, id: `added-${nanoid()}` }]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Header Builder</h2>
      <Header onAddHeader={handleAddHeader} />

      <div style={{ marginTop: "30px" }}>
        <h3>Added Headers</h3>
        <div style={{ border: "1px solid #dee2e6", borderRadius: "5px", padding: "20px" }}>
          {headers.length === 0 ? (
            <p>No headers added yet. Select a header template to start!</p>
          ) : (
            headers.map((header) => (
              <div
                key={header.id}
                style={{
                  ...header.props.style,
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ced4da",
                  borderRadius: "5px",
                }}
              >
                {header.props.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddHeaders;
