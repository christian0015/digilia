// Header.js
import React from "react";
import { nanoid } from "nanoid";

const Header = ({ onAddHeader }) => {
  const headerTemplates = [
    {
      id: `header-${nanoid()}`,
      type: "header",
      props: {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#1e1e1e",
          color: "#ffffff",
          borderBottom: "2px solid #007bff",
        },
      },
      children: [
        {
          id: `nav-${nanoid()}`,
          type: "nav",
          props: {
            style: {
              display: "flex",
              gap: "20px",
            },
          },
          children: [
            { id: `link-${nanoid()}`, type: "link", props: { text: "Home" } },
            { id: `link-${nanoid()}`, type: "link", props: { text: "Services" } },
            { id: `link-${nanoid()}`, type: "link", props: { text: "About" } },
            { id: `link-${nanoid()}`, type: "link", props: { text: "Contact" } },
          ],
        },
      ],
    },
    {
      id: `header-${nanoid()}`,
      type: "header",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "15px 30px",
          backgroundColor: "#f8f9fa",
          color: "#333",
          borderBottom: "2px solid #ddd",
        },
      },
      children: [
        {
          id: `nav-${nanoid()}`,
          type: "nav",
          props: {
            style: {
              display: "flex",
              gap: "15px",
            },
          },
          children: [
            { id: `link-${nanoid()}`, type: "link", props: { text: "Portfolio" } },
            { id: `link-${nanoid()}`, type: "link", props: { text: "Blog" } },
            { id: `link-${nanoid()}`, type: "link", props: { text: "Contact" } },
          ],
        },
      ],
    },
  ];

  const renderPreview = (template) => {
    return (
      <div
        style={{
          ...template.props.style,
          border: "1px dashed #ced4da",
          cursor: "pointer",
        }}
        key={template.id}
      >
        <nav style={template.children[0].props.style}>
          {template.children[0].children.map((link) => (
            <span key={link.id} style={{ color: "#007bff" }}>
              {link.props.text}
            </span>
          ))}
        </nav>
      </div>
    );
  };

  return (
    <div>
      <h3>Available Headers</h3>
      <div style={{ display: "flex", gap: "10px" }}>
        {headerTemplates.map((template) => (
          <div key={template.id}>
            {renderPreview(template)}
            <button
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => onAddHeader(template)}
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;