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
    {
      id: `page-container-${nanoid()}`,
      type: "container",
      props: { 
        style: { 
          fontFamily: "Poppins, sans-serif",
          margin: "0",
          padding: "0",
          backgroundColor: "#f5f5f7"
        } 
      },
      children: [
        {
          id: `header-section-${nanoid()}`,
          type: "container",
          props: { 
            style: { 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "20px 40px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              position: "sticky",
              top: "0",
              zIndex: "100"
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
                {
                  id: `nav-link-1-${nanoid()}`,
                  type: "link",
                  props: { 
                    href: "#produits",
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
                          text: "Produits" 
                        }
                      }
                  },
                },
                {
                  id: `nav-link-2-${nanoid()}`,
                  type: "link",
                  props: { 
                    href: "#pourquoi-nous",
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
                        text: "Pourquoi Nous" 
                      }
                    }
                  },            
                },
                {
                  id: `nav-link-3-${nanoid()}`,
                  type: "link",
                  props: { 
                    href: "#temoignages",
                    children: {
                      id: `text-${nanoid()}`,
                      type: "text",
                      props: { 
                        href: "#temoignages", 
                        style: {
                          color: "#333",
                          textDecoration: "none",
                          fontSize: "16px",
                          fontWeight: "500",
                          transition: "all 0.3s ease"
                        },
                        text: "Témoignages" 
                      }
                    }                    
                  }                  
                },
                {
                  id: `nav-link-4-${nanoid()}`,
                  type: "link",
                  props: { 
                    href: "#faq",
                    children: {
                      id: `text-${nanoid()}`,
                      type: "text",
                      props: { 
                        href: "#faq", 
                        style: {
                          color: "#333",
                          textDecoration: "none",
                          fontSize: "16px",
                          fontWeight: "500",
                          transition: "all 0.3s ease"
                        },
                        text: "FAQ" 
                      }
                    }
                  }
                },
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
        {
          id: `hero-section-${nanoid()}`,
          type: "container",
          props: { 
            style: { 
              display: "flex", 
              alignItems: "center",
              justifyContent: "space-between",
              padding: "60px 40px",
              background: "linear-gradient(135deg, #f5f5f7 0%, #e8e8ec 100%)",
              overflow: "hidden"
            } 
          },
          children: [
            {
              id: `hero-content-${nanoid()}`,
              type: "container",
              props: { 
                style: { 
                  flex: "1",
                  paddingRight: "40px",
                  maxWidth: "600px"
                } 
              },
              children: [
                {
                  id: `hero-title-${nanoid()}`,
                  type: "text",
                  props: { 
                    style: { 
                      color: "#212529", 
                      fontSize: "48px",
                      fontWeight: "800",
                      marginBottom: "20px",
                      lineHeight: "1.2"
                    }, 
                    text: "Élégance en or pour votre poignet" 
                  }
                },
                {
                  id: `hero-description-${nanoid()}`,
                  type: "text",
                  props: { 
                    style: { 
                      color: "#495057",
                      fontSize: "18px",
                      lineHeight: "1.6",
                      marginBottom: "30px"
                    }, 
                    text: "Découvrez notre collection exclusive de bracelets dorés, où l'artisanat rencontre le luxe moderne. Chaque pièce est méticuleusement conçue pour ajouter une touche d'élégance à votre style quotidien." 
                  }
                },
                {
                  id: `hero-button-${nanoid()}`,
                  type: "link",
                  props: { 
                    href: "#produits", 
                    children: {
                      type: "button",
                      props: {
                        style: {
                          padding: "15px 30px",
                          backgroundColor: "#D4AF37",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "30px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "16px",
                          boxShadow: "0 10px 20px rgba(212, 175, 55, 0.3)",
                          transition: "all 0.3s ease"
                        },
                        children: "Voir la collection"
                      }
                    }
                  }
                }
              ]
            },
            {
              id: `hero-image-container-${nanoid()}`,
              type: "container",
              props: { 
                style: { 
                  flex: "1",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                } 
              },
              children: [
                {
                  id: `hero-image-${nanoid()}`,
                  type: "image",
                  props: { 
                    src: "https://aimybijouxfantaisie.com/wp-content/uploads/2019/09/Set-de-bracelets-jonc.jpeg", 
                    alt: "Bracelet doré de luxe", 
                    style: { 
                      width: "100%", 
                      maxWidth: "500px",
                      height: "auto",
                      borderRadius: "20px",
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                      transform: "perspective(1000px) rotateY(-15deg)"
                    } 
                  }
                }
              ]
            }
          ]
        },
        {
          id: `pourquoi-nous-section-${nanoid()}`,
          type: "container",
          props: { 
            style: { 
              padding: "80px 40px",
              textAlign: "center",
              backgroundColor: "#ffffff"
            } 
          },
          children: [
            {
              id: `pourquoi-title-${nanoid()}`,
              type: "text",
              props: { 
                style: { 
                  color: "#212529", 
                  fontSize: "36px",
                  fontWeight: "700",
                  marginBottom: "20px"
                }, 
                text: "Pourquoi Nous Choisir?" 
              }
            },
            {
              id: `pourquoi-container-${nanoid()}`,
              type: "container",
              props: { 
                style: { 
                  display: "flex", 
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "30px",
                  marginTop: "40px"
                } 
              },
              children: [
                {
                  id: `pourquoi-item-1-${nanoid()}`,
                  type: "container",
                  props: { 
                    style: { 
                      flex: "1",
                      minWidth: "280px",
                      maxWidth: "320px",
                      padding: "30px 20px",
                      backgroundColor: "#ffffff",
                      borderRadius: "15px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease"
                    } 
                  },
                  children: [
                    {
                      id: `pourquoi-icon-1-${nanoid()}`,
                      type: "image",
                      props: { 
                        src: "https://cdn-icons-png.flaticon.com/512/2956/2956744.png", 
                        alt: "Qualité premium", 
                        style: { 
                          width: "60px", 
                          height: "auto",
                          marginBottom: "15px"
                        } 
                      }
                    },
                    {
                      id: `pourquoi-item-title-1-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#212529", 
                          fontSize: "20px",
                          fontWeight: "600",
                          marginBottom: "10px"
                        }, 
                        text: "Qualité Premium" 
                      }
                    },
                    {
                      id: `pourquoi-item-desc-1-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#495057",
                          fontSize: "15px",
                          lineHeight: "1.5"
                        }, 
                        text: "Des matériaux de la plus haute qualité, sélectionnés pour leur durabilité et leur éclat durable." 
                      }
                    }
                  ]
                },
                {
                  id: `pourquoi-item-2-${nanoid()}`,
                  type: "container",
                  props: { 
                    style: { 
                      flex: "1",
                      minWidth: "280px",
                      maxWidth: "320px",
                      padding: "30px 20px",
                      backgroundColor: "#ffffff",
                      borderRadius: "15px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease"
                    } 
                  },
                  children: [
                    {
                      id: `pourquoi-icon-2-${nanoid()}`,
                      type: "image",
                      props: { 
                        src: "https://cdn-icons-png.flaticon.com/512/3500/3500833.png", 
                        alt: "Design unique", 
                        style: { 
                          width: "60px", 
                          height: "auto",
                          marginBottom: "15px"
                        } 
                      }
                    },
                    {
                      id: `pourquoi-item-title-2-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#212529", 
                          fontSize: "20px",
                          fontWeight: "600",
                          marginBottom: "10px"
                        }, 
                        text: "Design Unique" 
                      }
                    },
                    {
                      id: `pourquoi-item-desc-2-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#495057",
                          fontSize: "15px",
                          lineHeight: "1.5"
                        }, 
                        text: "Chaque bracelet est une création originale, conçue par nos artisans pour se démarquer." 
                      }
                    }
                  ]
                },
                {
                  id: `pourquoi-item-3-${nanoid()}`,
                  type: "container",
                  props: { 
                    style: { 
                      flex: "1",
                      minWidth: "280px",
                      maxWidth: "320px", 
                      padding: "30px 20px",
                      backgroundColor: "#ffffff",
                      borderRadius: "15px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease"
                    } 
                  },
                  children: [
                    {
                      id: `pourquoi-icon-3-${nanoid()}`,
                      type: "image",
                      props: { 
                        src: "https://cdn-icons-png.flaticon.com/512/1170/1170678.png", 
                        alt: "Livraison rapide", 
                        style: { 
                          width: "60px", 
                          height: "auto",
                          marginBottom: "15px"
                        } 
                      }
                    },
                    {
                      id: `pourquoi-item-title-3-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#212529", 
                          fontSize: "20px",
                          fontWeight: "600",
                          marginBottom: "10px"
                        }, 
                        text: "Livraison Rapide" 
                      }
                    },
                    {
                      id: `pourquoi-item-desc-3-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#495057",
                          fontSize: "15px",
                          lineHeight: "1.5"
                        }, 
                        text: "Nous livrons vos bijoux en 48h avec un suivi en temps réel et un emballage de luxe." 
                      }
                    }
                  ]
                },
                {
                  id: `pourquoi-item-4-${nanoid()}`,
                  type: "container",
                  props: { 
                    style: { 
                      flex: "1",
                      minWidth: "280px",
                      maxWidth: "320px",
                      padding: "30px 20px",
                      backgroundColor: "#ffffff",
                      borderRadius: "15px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease"
                    } 
                  },
                  children: [
                    {
                      id: `pourquoi-icon-4-${nanoid()}`,
                      type: "image",
                      props: { 
                        src: "https://cdn-icons-png.flaticon.com/512/2107/2107957.png", 
                        alt: "Garantie à vie", 
                        style: { 
                          width: "60px", 
                          height: "auto",
                          marginBottom: "15px"
                        } 
                      }
                    },
                    {
                      id: `pourquoi-item-title-4-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#212529", 
                          fontSize: "20px",
                          fontWeight: "600",
                          marginBottom: "10px"
                        }, 
                        text: "Garantie à Vie" 
                      }
                    },
                    {
                      id: `pourquoi-item-desc-4-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#495057",
                          fontSize: "15px",
                          lineHeight: "1.5"
                        }, 
                        text: "Tous nos bracelets sont garantis à vie contre les défauts de fabrication." 
                      }
                    }
                  ]
                },
                {
                  id: `pourquoi-item-5-${nanoid()}`,
                  type: "container",
                  props: { 
                    style: { 
                      flex: "1",
                      minWidth: "280px",
                      maxWidth: "320px",
                      padding: "30px 20px",
                      backgroundColor: "#ffffff",
                      borderRadius: "15px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease"
                    } 
                  },
                  children: [
                    {
                      id: `pourquoi-icon-5-${nanoid()}`,
                      type: "image",
                      props: { 
                        src: "https://cdn-icons-png.flaticon.com/512/2331/2331966.png", 
                        alt: "Service client 24/7", 
                        style: { 
                          width: "60px", 
                          height: "auto",
                          marginBottom: "15px"
                        } 
                      }
                    },
                    {
                      id: `pourquoi-item-title-5-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#212529", 
                          fontSize: "20px",
                          fontWeight: "600",
                          marginBottom: "10px"
                        }, 
                        text: "Service Client 24/7" 
                      }
                    },
                    {
                      id: `pourquoi-item-desc-5-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#495057",
                          fontSize: "15px",
                          lineHeight: "1.5"
                        }, 
                        text: "Notre équipe de conseillers est disponible 24h/24 pour répondre à toutes vos questions." 
                      }
                    }
                  ]
                },
                {
                  id: `pourquoi-item-6-${nanoid()}`,
                  type: "container",
                  props: { 
                    style: { 
                      flex: "1",
                      minWidth: "280px",
                      maxWidth: "320px",
                      padding: "30px 20px",
                      backgroundColor: "#ffffff",
                      borderRadius: "15px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease"
                    } 
                  },
                  children: [
                    {
                      id: `pourquoi-icon-6-${nanoid()}`,
                      type: "image",
                      props: { 
                        src: "https://cdn-icons-png.flaticon.com/512/1632/1632708.png", 
                        alt: "Personnalisation", 
                        style: { 
                          width: "60px", 
                          height: "auto",
                          marginBottom: "15px"
                        } 
                      }
                    },
                    {
                      id: `pourquoi-item-title-6-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#212529", 
                          fontSize: "20px",
                          fontWeight: "600",
                          marginBottom: "10px"
                        }, 
                        text: "Personnalisation" 
                      }
                    },
                    {
                      id: `pourquoi-item-desc-6-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#495057",
                          fontSize: "15px",
                          lineHeight: "1.5"
                        }, 
                        text: "Gravure et ajustements sur mesure disponibles pour un bijou vraiment unique." 
                      }
                    }
                  ]
                },
                
                {
                  id: `products-section-${nanoid()}`,
                  type: "container",
                  props: { 
                    style: { 
                      padding: "80px 40px",
                      backgroundColor: "#f8f9fa"
                    } 
                  },
                  children: [
                    {
                      id: `products-title-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#212529", 
                          fontSize: "36px",
                          fontWeight: "700",
                          marginBottom: "50px",
                          textAlign: "center"
                        }, 
                        text: "Nos Bracelets Exclusifs" 
                      }
                    },
                    {
                      id: `products-container-${nanoid()}`,
                      type: "container",
                      props: { 
                        style: { 
                          display: "flex", 
                          flexWrap: "wrap",
                          justifyContent: "center",
                          gap: "40px"
                        } 
                      },
                      children: [
                        {
                          id: `product-card-1-${nanoid()}`,
                          type: "container",
                          props: { 
                            style: { 
                              width: "300px",
                              backgroundColor: "#ffffff",
                              borderRadius: "20px",
                              overflow: "hidden",
                              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
                              transition: "all 0.3s ease",
                              transform: "translateY(0)"
                            } 
                          },
                          children: [
                            {
                              id: `product-image-1-${nanoid()}`,
                              type: "image",
                              props: { 
                                src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
                                alt: "Bracelet Luxe Doré", 
                                style: { 
                                  width: "100%", 
                                  height: "250px",
                                  objectFit: "cover"
                                } 
                              }
                            },
                            {
                              id: `product-details-1-${nanoid()}`,
                              type: "container",
                              props: { 
                                style: { 
                                  padding: "20px"
                                } 
                              },
                              children: [
                                {
                                  id: `product-title-1-${nanoid()}`,
                                  type: "text",
                                  props: { 
                                    style: { 
                                      color: "#212529", 
                                      fontSize: "20px",
                                      fontWeight: "600",
                                      marginBottom: "10px"
                                    }, 
                                    text: "Bracelet Royal" 
                                  }
                                },
                                {
                                  id: `product-price-1-${nanoid()}`,
                                  type: "text",
                                  props: { 
                                    style: { 
                                      color: "#D4AF37",
                                      fontSize: "24px",
                                      fontWeight: "700",
                                      marginBottom: "20px"
                                    }, 
                                    text: "189€" 
                                  }
                                },
                                {
                                  id: `product-button-1-${nanoid()}`,
                                  type: "link",
                                  props: { 
                                    href: "#", 
                                    children: {
                                      type: "button",
                                      props: {
                                        style: {
                                          width: "100%",
                                          padding: "12px",
                                          backgroundColor: "#D4AF37",
                                          color: "#ffffff",
                                          border: "none",
                                          borderRadius: "30px",
                                          cursor: "pointer",
                                          fontWeight: "600",
                                          boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)",
                                          transition: "all 0.3s ease"
                                        },
                                        children: "Acheter"
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        },
                        {
                          id: `product-card-2-${nanoid()}`,
                          type: "container",
                          props: { 
                            style: { 
                              width: "300px",
                              backgroundColor: "#ffffff",
                              borderRadius: "20px",
                              overflow: "hidden",
                              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
                              transition: "all 0.3s ease",
                              transform: "translateY(0)"
                            } 
                          },
                          children: [
                            {
                              id: `product-image-2-${nanoid()}`,
                              type: "image",
                              props: { 
                                src: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
                                alt: "Bracelet Élégance", 
                                style: { 
                                  width: "100%", 
                                  height: "250px",
                                  objectFit: "cover"
                                } 
                              }
                            },
                            {
                              id: `product-details-2-${nanoid()}`,
                              type: "container",
                              props: { 
                                style: { 
                                  padding: "20px"
                                } 
                              },
                              children: [
                                {
                                  id: `product-title-2-${nanoid()}`,
                                  type: "text",
                                  props: { 
                                    style: { 
                                      color: "#212529", 
                                      fontSize: "20px",
                                      fontWeight: "600",
                                      marginBottom: "10px"
                                    }, 
                                    text: "Bracelet Élégance" 
                                  }
                                },
                                {
                                  id: `product-price-2-${nanoid()}`,
                                  type: "text",
                                  props: { 
                                    style: { 
                                      color: "#D4AF37",
                                      fontSize: "24px",
                                      fontWeight: "700",
                                      marginBottom: "20px"
                                    }, 
                                    text: "149€" 
                                  }
                                },
                                {
                                  id: `product-button-2-${nanoid()}`,
                                  type: "link",
                                  props: { 
                                    href: "#", 
                                    children: {
                                      type: "button",
                                      props: {
                                        style: {
                                          width: "100%",
                                          padding: "12px",
                                          backgroundColor: "#D4AF37",
                                          color: "#ffffff",
                                          border: "none",
                                          borderRadius: "30px",
                                          cursor: "pointer",
                                          fontWeight: "600",
                                          boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)",
                                          transition: "all 0.3s ease"
                                        },
                                        children: "Acheter"
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        },
                        {
                          id: `product-card-3-${nanoid()}`,
                          type: "container",
                          props: { 
                            style: { 
                              width: "300px",
                              backgroundColor: "#ffffff",
                              borderRadius: "20px",
                              overflow: "hidden",
                              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
                              transition: "all 0.3s ease",
                              transform: "translateY(0)"
                            } 
                          },
                          children: [
                            {
                              id: `product-image-3-${nanoid()}`,
                              type: "image",
                              props: { 
                                src: "https://images.unsplash.com/photo-1618522285348-b13f25ef9de6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
                                alt: "Bracelet Prestige", 
                                style: { 
                                  width: "100%", 
                                  height: "250px",
                                  objectFit: "cover"
                                } 
                              }
                            },
                            {
                              id: `product-details-3-${nanoid()}`,
                              type: "container",
                              props: { 
                                style: { 
                                  padding: "20px"
                                } 
                              },
                              children: [
                                {
                                  id: `product-title-3-${nanoid()}`,
                                  type: "text",
                                  props: { 
                                    style: { 
                                      color: "#212529", 
                                      fontSize: "20px",
                                      fontWeight: "600",
                                      marginBottom: "10px"
                                    }, 
                                    text: "Bracelet Prestige" 
                                  }
                                },
                                {
                                  id: `product-price-3-${nanoid()}`,
                                  type: "text",
                                  props: { 
                                    style: { 
                                      color: "#D4AF37",
                                      fontSize: "24px",
                                      fontWeight: "700",
                                      marginBottom: "20px"
                                    }, 
                                    text: "219€" 
                                  }
                                },
                                {
                                  id: `product-button-3-${nanoid()}`,
                                  type: "link",
                                  props: { 
                                    href: "#", 
                                    children: {
                                      type: "button",
                                      props: {
                                        style: {
                                          width: "100%",
                                          padding: "12px",
                                          backgroundColor: "#D4AF37",
                                          color: "#ffffff",
                                          border: "none",
                                          borderRadius: "30px",
                                          cursor: "pointer",
                                          fontWeight: "600",
                                          boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)",
                                          transition: "all 0.3s ease"
                                        },
                                        children: "Acheter"
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },

                {
                  id: `testimonials-section-${nanoid()}`,
                  type: "container",
                  props: { 
                    style: { 
                      padding: "80px 40px",
                      backgroundColor: "#ffffff"
                    } 
                  },
                  children: [
                    {
                      id: `testimonials-title-${nanoid()}`,
                      type: "text",
                      props: { 
                        style: { 
                          color: "#212529", 
                          fontSize: "36px",
                          fontWeight: "700",
                          marginBottom: "50px",
                          textAlign: "center"
                        }, 
                        text: "Ce que nos clients disent" 
                      }
                    },
                    {
                      id: `testimonials-container-${nanoid()}`,
                      type: "container",
                      props: { 
                        style: { 
                          display: "flex", 
                          flexWrap: "wrap",
                          justifyContent: "center",
                          gap: "30px"
                        } 
                      },
                      children: [
                        {
                          id: `testimonial-1-${nanoid()}`,
                          type: "container",
                          props: { 
                            style: { 
                              width: "350px",
                              padding: "30px",
                              backgroundColor: "#ffffff",
                              borderRadius: "15px",
                              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.05)",
                              border: "1px solid #f0f0f0"
                            } 
                          },
                          children: [
                            {
                              id: `stars-1-${nanoid()}`,
                              type: "container",
                              props: { 
                                style: { 
                                  display: "flex",
                                  marginBottom: "15px"
                                } 
                              },
                              children: [
                                {
                                  id: `star-1-1-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", 
                                    alt: "Étoile", 
                                    style: { 
                                      width: "20px", 
                                      height: "20px",
                                      marginRight: "5px"
                                    } 
                                  }
                                },
                                {
                                  id: `star-1-2-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", 
                                    alt: "Étoile", 
                                    style: { 
                                      width: "20px", 
                                      height: "20px",
                                      marginRight: "5px"
                                    } 
                                  }
                                },
                                {
                                  id: `star-1-3-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", 
                                    alt: "Étoile", 
                                    style: { 
                                      width: "20px", 
                                      height: "20px",
                                      marginRight: "5px"
                                    } 
                                  }
                                },
                                {
                                  id: `star-1-4-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", 
                                    alt: "Étoile", 
                                    style: { 
                                      width: "20px", 
                                      height: "20px",
                                      marginRight: "5px"
                                    } 
                                  }
                                },
                                {
                                  id: `star-1-5-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", 
                                    alt: "Étoile", 
                                    style: { 
                                      width: "20px", 
                                      height: "20px"
                                    } 
                                  }
                                }
                              ]
                            },
                            {
                              id: `testimonial-text-1-${nanoid()}`,
                              type: "text",
                              props: { 
                                style: { 
                                  color: "#495057",
                                  fontSize: "16px",
                                  lineHeight: "1.6",
                                  marginBottom: "20px",
                                  fontStyle: "italic"
                                }, 
                                text: "\"J'ai offert le bracelet Royal à ma femme pour notre anniversaire, elle ne le quitte plus ! La qualité est exceptionnelle et le service client a été impeccable.\"" 
                              }
                            },
                            {
                              id: `testimonial-author-1-${nanoid()}`,
                              type: "container",
                              props: { 
                                style: { 
                                  display: "flex",
                                  alignItems: "center"
                                } 
                              },
                              children: [
                                {
                                  id: `author-avatar-1-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://randomuser.me/api/portraits/men/32.jpg", 
                                    alt: "Thomas D.", 
                                    style: { 
                                      width: "40px", 
                                      height: "40px",
                                      borderRadius: "50%",
                                      marginRight: "15px"
                                    } 
                                  }
                                },
                                {
                                  id: `author-name-1-${nanoid()}`,
                                  type: "text",
                                  props: { 
                                    style: { 
                                      color: "#212529",
                                      fontSize: "16px",
                                      fontWeight: "600"
                                    }, 
                                    text: "Thomas D." 
                                  }
                                }
                              ]
                            }
                          ]
                        },
                        {
                          id: `testimonial-2-${nanoid()}`,
                          type: "container",
                          props: { 
                            style: { 
                              width: "350px",
                              padding: "30px",
                              backgroundColor: "#ffffff",
                              borderRadius: "15px",
                              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.05)",
                              border: "1px solid #f0f0f0"
                            } 
                          },
                          children: [
                            {
                              id: `stars-2-${nanoid()}`,
                              type: "container",
                              props: { 
                                style: { 
                                  display: "flex",
                                  marginBottom: "15px"
                                } 
                              },
                              children: [
                                {
                                  id: `star-2-1-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", 
                                    alt: "Étoile", 
                                    style: { 
                                      width: "20px", 
                                      height: "20px",
                                      marginRight: "5px"
                                    } 
                                  }
                                },
                                {
                                  id: `star-2-2-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", 
                                    alt: "Étoile", 
                                    style: { 
                                      width: "20px", 
                                      height: "20px",
                                      marginRight: "5px"
                                    } 
                                  }
                                },
                                {
                                  id: `star-2-3-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", 
                                    alt: "Étoile", 
                                    style: { 
                                      width: "20px", 
                                      height: "20px",
                                      marginRight: "5px"
                                    } 
                                  }
                                },
                                {
                                  id: `star-2-4-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", 
                                    alt: "Étoile", 
                                    style: { 
                                      width: "20px", 
                                      height: "20px",
                                      marginRight: "5px"
                                    } 
                                  }
                                },
                                {
                                  id: `star-2-5-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://cdn-icons-png.flaticon.com/512/1828/1828961.png", 
                                    alt: "Demi-étoile", 
                                    style: { 
                                      width: "20px", 
                                      height: "20px"
                                    } 
                                  }
                                }
                              ]
                            },
                            {
                              id: `testimonial-text-2-${nanoid()}`,
                              type: "text",
                              props: { 
                                style: { 
                                  color: "#495057",
                                  fontSize: "16px",
                                  lineHeight: "1.6",
                                  marginBottom: "20px",
                                  fontStyle: "italic"
                                }, 
                                text: "\"La finition est parfaite et l'éclat du bracelet Élégance est magnifique. Je reçois beaucoup de compliments ! Livraison rapide comme promis.\"" 
                              }
                            },
                            {
                              id: `testimonial-author-2-${nanoid()}`,
                              type: "container",
                              props: { 
                                style: { 
                                  display: "flex",
                                  alignItems: "center"
                                } 
                              },
                              children: [
                                {
                                  id: `author-avatar-2-${nanoid()}`,
                                  type: "image",
                                  props: { 
                                    src: "https://randomuser.me/api/portraits/women/44.jpg", 
                                    alt: "Sophie M.", 
                                    style: { 
                                      width: "40px", 
                                      height: "40px",
                                      borderRadius: "50%",
                                      marginRight: "15px"
                                    } 
                                  }
                                },
                                {
                                  id: `author-name-2-${nanoid()}`,
                                  type: "text",
                                  props: { 
                                    style: { 
                                      color: "#212529",
                                      fontSize: "16px",
                                      fontWeight: "600"
                                    }, 
                                    text: "Sophie M." 
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },

                {
                  id: `faq-section-${nanoid()}`,
                  type: "container",
                  props: { 
                    style: { 
                      padding: "80px 40px",
                      backgroundColor: "#f8f9fa"
                    } 
                  },
                  children: [
                    {
                      id: `faq-title-${nanoid()}`,
                      type: "text",
                      props: {    
                        style: { 
                              padding: "80px 40px",
                              backgroundColor: "#f8f9fa"
                        } 
                            
                      }
                    }
                  ]
                }
              ]
              }
            ]
          }
        ]
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
