// Header.js
import React from "react";
import { nanoid } from "nanoid";

const Header = ({ onAddContainer }) => {
  const headerTemplates = [
    {
      id: `header-goldenlink-${nanoid()}`,
      type: "container",
      props: {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }
      },
      children: [
        {
          id: `logo-container-${nanoid()}`,
          type: "container",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }
          },
          children: [
            {
              id: `logo-image-${nanoid()}`,
              type: "image",
              props: {
                src: "https://www.pngall.com/wp-content/uploads/7/Golden-Bracelet-PNG-Clipart.png",
                alt: "Logo Bracelet Doré",
                style: {
                  width: "50px",
                  height: "auto"
                }
              }
            },
            {
              id: `logo-text-${nanoid()}`,
              type: "text",
              props: {
                style: {
                  color: "#D4AF37",
                  fontSize: "24px",
                  fontWeight: "700",
                  letterSpacing: "1px"
                },
                text: "GoldenLink"
              }
            }
          ]
        },
        {
          id: `navigation-${nanoid()}`,
          type: "container",
          props: {
            style: {
              display: "flex",
              gap: "30px"
            }
          },
          children: [
            ...["Produits", "Pourquoi Nous", "Témoignages", "FAQ"].map((label, i) => ({
              id: `nav-link-${i + 1}-${nanoid()}`,
              type: "link",
              props: {
                href: `#${label.toLowerCase().replace(/\s+/g, "-")}`,
                children: {
                  id: `text-${nanoid()}`,
                  type: "text",
                  props: {
                    style: {
                      color: "#333",
                      textDecoration: "none",
                      fontSize: "16px",
                      fontWeight: "500",
                      transition: "all 0.3s ease"
                    },
                    text: label
                  }
                }
              }
            })),
            {
              id: `nav-button-${nanoid()}`,
              type: "button",
              props: {
                onClick: "navigateToProduits", // Vous pouvez gérer ça dans votre logique
                style: {
                  padding: "10px 20px",
                  backgroundColor: "#D4AF37",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontWeight: "600",
                  boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)",
                  transition: "all 0.3s ease"
                },
                children: ["Acheter"]
              }
            }
            
          ]
        }
      ]
    },
  
    // ---------------------- HEADER 2 : Luxe / Aura ------------------------
  
    {
      id: `header-luxury-${nanoid()}`,
      type: "container",
      props: {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "25px 60px",
          background: "linear-gradient(to right, #0f0f0f, #1a1a1a)",
          color: "#fff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
        }
      },
      children: [
        {
          id: `lux-logo-${nanoid()}`,
          type: "container",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }
          },
          children: [
            {
              id: `lux-icon-${nanoid()}`,
              type: "image",
              props: {
                src: "https://cdn-icons-png.flaticon.com/512/1823/1823444.png",
                alt: "Luxury Icon",
                style: {
                  width: "45px",
                  filter: "brightness(1.2)"
                }
              }
            },
            {
              id: `lux-title-${nanoid()}`,
              type: "text",
              props: {
                style: {
                  fontSize: "26px",
                  fontWeight: "800",
                  letterSpacing: "2px",
                  background: "linear-gradient(90deg, #FFD700, #FFA500)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                },
                text: "Luxora"
              }
            }
          ]
        },
        {
          id: `lux-nav-${nanoid()}`,
          type: "container",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "40px"
            }
          },
          children: [
            ...["Collection", "À propos", "Presse", "Contact"].map((label, i) => ({
              id: `lux-link-${i + 1}-${nanoid()}`,
              type: "link",
              props: {
                href: `#${label.toLowerCase().replace(/\s+/g, "-")}`,
                children: {
                  id: `text-${nanoid()}`,
                  type: "text",
                  props: {
                    style: {
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#ffffffcc",
                      textDecoration: "none",
                      transition: "color 0.3s ease"
                    },
                    text: label
                  }
                }
              }
            })),
            {
              id: `lux-btn-${nanoid()}`,
              type: "button",
              props: {
                style: {
                  background: "linear-gradient(to right, #FFD700, #FFA500)",
                  border: "none",
                  padding: "10px 25px",
                  borderRadius: "30px",
                  color: "#000",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
                  transition: "all 0.3s ease"
                },
                children: ["Découvrir"]
              }
            }
          ]
        }
      ]
    }
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

export default Header;
