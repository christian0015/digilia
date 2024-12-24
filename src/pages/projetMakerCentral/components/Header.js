import React from "react";
import { nanoid } from "nanoid";

const Header = ({ onAddHeader }) => {
  const headerTemplates = [
    {
      id: `header-${nanoid()}`,
      type: "header",
      props: {
        style: {
          width: "100%",
          backgroundColor: "#343a40",
          color: "#ffffff",
          padding: "20px",
        },
        children: [
          {
            id: `logo-${nanoid()}`,
            type: "logo",
            props: {
              style: { fontSize: "1.5rem", fontWeight: "bold" },
              text: "Logo",
            },
          },
          {
            id: `nav-${nanoid()}`,
            type: "nav",
            props: {
              style: {
                display: "flex",
                listStyle: "none",
                gap: "15px",
              },
              links: ["Home", "Services", "About", "Contact"],
              linkStyle: { color: "#ffffff", textDecoration: "none" },
            },
          },
        ],
      },
    },
    {
      id: `header-${nanoid()}`,
      type: "header",
      props: {
        style: {
          width: "100%",
          backgroundColor: "#f8f9fa",
          color: "#212529",
          padding: "15px 20px",
        },
        children: [
          {
            id: `logo-${nanoid()}`,
            type: "logo",
            props: {
              style: { fontSize: "1.5rem", fontWeight: "bold" },
              text: "Brand",
            },
          },
          {
            id: `nav-${nanoid()}`,
            type: "nav",
            props: {
              style: {
                display: "flex",
                listStyle: "none",
                gap: "15px",
              },
              links: ["Home", "Services", "About", "Contact"],
              linkStyle: { color: "#212529", textDecoration: "none" },
            },
          },
        ],
      },
    },
    {
      id: `header-${nanoid()}`,
      type: "header",
      props: {
        style: {
          width: "100%",
          background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
          color: "#ffffff",
          padding: "20px",
        },
        children: [
          {
            id: `logo-${nanoid()}`,
            type: "logo",
            props: {
              style: { fontSize: "1.5rem", fontWeight: "bold" },
              text: "Gradient",
            },
          },
          {
            id: `nav-${nanoid()}`,
            type: "nav",
            props: {
              style: {
                display: "flex",
                listStyle: "none",
                gap: "15px",
              },
              links: ["Home", "Services", "About", "Contact"],
              linkStyle: { color: "#ffffff", textDecoration: "none" },
            },
          },
        ],
      },
    },
  ];

  const renderHeader = (props) => {
    const { style, children } = props;
    return (
      <div style={{ ...style }}>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {children.map((child) => {
            if (child.type === "logo") {
              return (
                <div key={child.id} style={child.props.style}>
                  {child.props.text}
                </div>
              );
            }
            if (child.type === "nav") {
              return (
                <ul
                  key={child.id}
                  style={child.props.style}
                >
                  {child.props.links.map((link, index) => (
                    <li key={index}>
                      <a href="#" style={child.props.linkStyle}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              );
            }
            return null;
          })}
        </nav>
      </div>
    );
  };

  return (
    <div>
      <h3>Available Headers</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {headerTemplates.map((template) => (
          <div
            key={template.id}
            style={{
              border: "1px solid #ced4da",
              borderRadius: "5px",
              padding: "10px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            {renderHeader(template.props)}
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
