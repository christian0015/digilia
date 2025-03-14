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
      props: { style: { display: "flex", justifyContent: "space-evenly", backgroundColor: "#e9ecef", padding: "20px", margin: "10px" } },
      children: [
        {
          id: `container-${nanoid()}`,
          type: "container",
          props: { style: { backgroundColor: "#f8f9fa", padding: "20px", margin: "10px" } },
          children: [
            {
              id: `text-${nanoid()}`,
              type: "text",
              props: { style: { color: "#212529", fontSize: "24px", marginRight: "10px" }, text: "Grand Texte" },
            },
            {
              id: `text-${nanoid()}`,
              type: "text",
              props: { style: { color: "#495057" }, text: "Paragraphe à la ligne" },
            },
          ],
        },
        {
          id: `container-${nanoid()}`,
          type: "container",
          props: { style: { backgroundColor: "#f8f9fa", padding: "20px", margin: "10px" } },
          children: [
            {
              id: `image-${nanoid()}`,
              type: "image",
              props: { src: "https://i.pinimg.com/originals/dc/ca/c5/dccac58eb008ad76721cb3a4b9f905f2.jpg", alt: "Description de l'image", style: { width: "200px", height: "auto" } },
            },
          ],
        },
      ],
    },
    {
      id: `container-${nanoid()}`,
      type: "container",
      props: { display: "flex", justifyContent: "space-evenly", backgroundColor: "#e9ecef", padding: "20px", margin: "10px" },
      children: [
        {
          id: `text-${nanoid()}`,
          type: "text",
          props: { style: { color: "#212529", fontSize: "24px", marginRight: "10px" }, text: "Grand Texte" },
        },
        {
          id: `text-${nanoid()}`,
          type: "text",
          props: { style: { color: "#495057" }, text: "Paragraphe à la ligne" },
        },
        {
          id: `video-${nanoid()}`,
          type: "video",
          props: { src: "https://youtu.be/ICBP-7x7Chc?t=1063", controls: true, style: { width: "200px", height: "auto" } },
        },
      ],
    },
    {
      id: `container-${nanoid()}`,
      type: "container",
      props: { display: "flex", justifyContent: "space-evenly", backgroundColor: "#e9ecef", padding: "20px", margin: "10px" },
      children: [
        {
          id: `container-left-${nanoid()}`,
          type: "container",
          props: { style: { backgroundColor: "#f8f9fa", padding: "10px", margin: "10px" } },
          children: [
            {
              id: `image-${nanoid()}`,
              type: "image",
              props: { src: "image_url", alt: "Description de l'image", style: { width: "200px", height: "auto" } },
            },
            {
              id: `text-${nanoid()}`,
              type: "text",
              props: { style: { color: "#212529", fontSize: "24px" }, text: "Titre" },
            },
            {
              id: `text-${nanoid()}`,
              type: "text",
              props: { style: { color: "#495057" }, text: "Paragraphe à la ligne" },
            },
          ],
        },
        {
          id: `container-right-${nanoid()}`,
          type: "container",
          props: { style: { backgroundColor: "#f8f9fa", padding: "10px", margin: "10px" } },
          children: [
            {
              id: `video-${nanoid()}`,
              type: "video",
              props: { src: "video_url", controls: true, style: { width: "200px", height: "auto" } },
            },
            {
              id: `text-${nanoid()}`,
              type: "text",
              props: { style: { color: "#212529", fontSize: "24px" }, text: "Titre" },
            },
            {
              id: `link-${nanoid()}`,
              type: "link",
              props: { href: "#", children: { type: "button", props: { style: { padding: "10px 20px", backgroundColor: "#007bff", color: "#ffffff", border: "none", cursor: "pointer" }, children: "Button" } } },
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
          {template.children.map((child) => {
            if (child.type === "text") {
              return (
                <p key={child.id} style={child.props.style}>
                  {child.props.text}
                </p>
              );
            } else if (child.type === "image") {
              return (
                <img key={child.id} src={child.props.src} alt={child.props.alt} style={child.props.style} />
              );
            } else if (child.type === "video") {
              return (
                <video key={child.id} src={child.props.src} controls style={child.props.style}></video>
              );
            } else if (child.type === "link") {
              return (
                <a key={child.id} href={child.props.href} style={{ textDecoration: "none" }}>
                  <button style={child.props.children.props.style}>
                    {child.props.children.props.children}
                  </button>
                </a>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
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
