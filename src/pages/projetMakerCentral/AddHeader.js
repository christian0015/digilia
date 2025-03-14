

// AddHeaders.js
import React, { useState, useEffect } from "react";
import Header from "./components/Header";

const AddHeaders = () => {
  const storedHeaders = JSON.parse(localStorage.getItem("components")) || [];
  console.log(storedHeaders);
  
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    localStorage.setItem("components", JSON.stringify(headers));
  }, [headers]);

  const handleAddHeader = (template) => {
    const newHeader = {
      ...template,
      id: `header-${Date.now()}`,
      children: template.children.map((child) => ({
        ...child,
        id: `${child.id}-${Date.now()}`,
        children: child.children.map((grandchild) => ({
          ...grandchild,
          id: `${grandchild.id}-${Date.now()}`,
        })),
      })),
    };

    setHeaders((prev) => [...prev, newHeader]);
  };

  const renderHeader = (header) => (
    <div key={header.id} style={header.props.style}>
      <nav style={header.children[0].props.style}>
        {header.children[0].children.map((link) => (
          <span key={link.id} style={{ color: "#007bff", margin: "0 10px" }}>
            {link.props.text}
          </span>
        ))}
      </nav>
    </div>
  );

  return (
    <div>
      <h1>Header Editor</h1>
      <Header onAddHeader={handleAddHeader} />
      <div>
        {headers.map((header) => renderHeader(header))}
      </div>
    </div>
  );
};

export default AddHeaders;
