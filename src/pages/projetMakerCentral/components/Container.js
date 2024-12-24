import React from "react";
import { nanoid } from 'nanoid';

const Container = ({ onAddContainer }) => {
  const containerTemplates = [
    {
      id: `container-${nanoid()}`,
      type: "container",
      props: { style: { backgroundColor: "#f8f9fa", padding: "20px", margin: "10px" } },
      children: [],
    },
    {
      id: `container-${nanoid()}`,
      type: "container",
      props: { style: { backgroundColor: "#e9ecef", padding: "20px", margin: "10px" } },
      children: [
        {
          id: `text-${nanoid()}`,
          type: "text",
          props: { style: { color: "#212529", marginBottom: "10px" }, text: "Child Text 1" },
        },
        {
          id: `text-${nanoid()}`,
          type: "text",
          props: { style: { color: "#495057" }, text: "Child Text 2" },
        },
      ],
    },
    {
        id: `container-${nanoid()}`,
        type: "container",
        props: { style: { backgroundColor: "#e9ecef", padding: "20px", margin: "10px" } },
        children: [
            {
                id: `container-${nanoid()}`,
                type: "container",
                props: { style: { backgroundColor: "#e9ecef", padding: "20px", margin: "10px" } },
                children: [
                    {
                        id: `container-${nanoid()}`,
                        type: "container",
                        props: { style: { backgroundColor: "#e9ecef", padding: "20px", margin: "10px" } },
                        children: [
                            {
                                id: `container-${nanoid()}`,
                                type: "container",
                                props: { style: { backgroundColor: "#e9ecef", padding: "20px", margin: "10px" } },
                                children: [
                                    {
                                        id: `container-${nanoid()}`,
                                        type: "container",
                                        props: { style: { backgroundColor: "#e9ecef", padding: "20px", margin: "10px" } },
                                        children: [
                                          {
                                            id: `text-${nanoid()}`,
                                            type: "text",
                                            props: { style: { color: "#212529", marginBottom: "10px" }, text: "Child Text 1" },
                                          },
                                          {
                                            id: `text-${nanoid()}`,
                                            type: "text",
                                            props: { style: { color: "#495057" }, text: "Child Text 2" },
                                          },
                                        ],
                                      },
                                ],
                              },
                        ],
                      },
                ],
              },
        ],
      },
  ];

  const renderPreview = (template) => {
    if (template.type === "container") {
      return (
        <div
          style={{
            ...template.props.style,
            border: "1px dashed #ced4da",
            cursor: "pointer",
          }}
          key={template.id}
        >
          {template.children.map((child) => (
            <p key={child.id} style={child.props.style}>
              {child.props.text}
            </p>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <h3>Available Containers</h3>
      <div style={{ display: "flex", gap: "10px" }}>
        {containerTemplates.map((template) => (
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
              onClick={() => onAddContainer(template)}
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Container;
