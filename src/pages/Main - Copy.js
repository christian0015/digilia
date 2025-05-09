
import React, { useState, useEffect} from 'react';
import { Rnd } from "react-rnd";
import Container from "./projetMakerCentral/components/Container";
import Header from "./projetMakerCentral/components/Header";
import Label from './Dashboard';
import './ProjetMaker.css';
import { Link, NavLink  } from 'react-router-dom';import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import isEqual from "lodash.isequal"; // pour comparaison profonde

const userString = localStorage.getItem('digiliaUser');
const userProfil = JSON.parse(userString);

const cssFields = [
  "padding",
  "margin",
  "backgroundColor",
  "color",
  "fontSize",
  "display",
  "flex",
  "flexDirection",
  "flexWrap",
  "wrap",
  "justifyContent",
  "alignItems",
  "gap",
  "textAlign",
  "border",
  "borderRadius",
  "boxShadow",
  "width",
  "maxWidth",
  "height",
  "maxHeight",
];

const ProjetPage = () => {
  
  // ********************** Debut Route d"Affichage ********************** //
  // **********************                    ********************** //
  // Par défaut, le composant Home est affiché
  const [activeComponent, setActiveComponent] = useState(""); 
  // Fonction pour changer le composant
  const handleComponentChange = (component) => {
    setActiveComponent(component);
    setIsShownActiveComponent("block")
  };
  const [isShownActiveComponent, setIsShownActiveComponent] = useState("none");
  const toggleActiveComponent = () => {
    setIsShownActiveComponent("none");
  };
  const [isShown, setIsShown] = useState(false);
  const toggleContainerRigthProjetMaker = () => {
    setIsShown(!isShown);
    };
  // ********************** Fin Route d"Affichage ********************** //
  // **********************                    ********************** //

  // Drad RN
  const [size, setSize] = useState({ width: 400, height: 300 });
  const [position, setPosition] = useState({ x: 100, y: 100 });
  // Drad RN

  // ***************** Debut Ajout des Fonctionnalité ***************** //
  // **********************                    ********************** //
  // Charger les composants depuis le localStorage
  const storedComponents = JSON.parse(localStorage.getItem('components'))|| [];
  const [components, setComponents] = useState(storedComponents);
  
  const [history, setHistory] = useState([storedComponents]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedComponent, setSelectedComponent] = useState({});
  useEffect(() => {
      localStorage.setItem("components", JSON.stringify(components));
    }, [components]);

  // Propertie
  const [localProps, setLocalProps] = useState(selectedComponent?.props || {});
  // États locaux pour les champs de saisie
  const [inputValues, setInputValues] = useState({});

  const [localStyle, setLocalStyle] = useState({});

  const [hoveredContainerId, setHoveredContainerId] = useState(null);
  const [mode, setMode] = useState(null); // 'duplicate' | 'move'

  // Ajouter un conteneur  
  // ********************
  const handleAddContainer = (template) => {
    // Créer un nouveau conteneur avec ses enfants copiés
    const createNewContainer = (template) => ({
      ...template,  
      id: `container-${nanoid()}`, // ID unique pour ce conteneur
      // id: Date.now(), // ID unique pour ce conteneur
      children: template.children.map((child) =>
        child.type === "container" // Si l'enfant est un conteneur, réappliquez la logique récursive
          ? createNewContainer(child) 
          : { ...child, id: `${nanoid()}-${child.id}` } // Utilise nanoid pour des IDs uniques
          // : { ...child, id: `${Date.now()}-${child.id}` } // Copie simple pour les autres éléments
      ),
    });
  
    const newContainer = createNewContainer(template);
  
    if (selectedComponent) {
      // console.log(' Est un enfant de:', selectedComponent);
      // Ajouter comme enfant du conteneur sélectionné
      const addAsChild = (components, parentId, newChild) => {
        return components.map((component) => {
          if (component.id === parentId) {
            // Trouvé le parent, ajoutez l'enfant
            return {
              ...component,
              children: [...component.children, newChild],
            };
          } else if (component.children && component.children.length > 0) {
            // Continuez la recherche dans les enfants
            return {
              ...component,
              children: addAsChild(component.children, parentId, newChild),
            };
          }
          return component;
        });
      };
      
      setComponents((prev) => addAsChild(prev, selectedComponent.id, newContainer));
      // setSelectedComponent(null) // Deselectionner
      selectComponent(selectedComponent.id)
    } else {
      // Ajouter comme nouvel élément principal
      setComponents((prev) => [...prev, newContainer]);
    }
  };

  // Mettre à jour les propriétés d'un composant
  // *******************************************
  // Verification du composant à modifier
  const findComponentById = (components, id) => {
    for (let component of components) {
      if (component.id === id) {
        return component;
      }
      if (component.children) {
        const foundChild = findComponentById(component.children, id);
        if (foundChild) {
          return foundChild;
        }
      }
    }
    return null;
  };
  // Mise à jours proprement dite
  const updateComponentProps = (id, updatedProps) => {
    const componentChanger = components.map((component) =>component.id === id)
    const componentChangerB = findComponentById(components, id);

    if (!componentChanger) {
      console.error(`Component with id ${id} not found.`);
      return;
    }
    
    const updateComponentAndChildren = (component, id, updatedProps) => {
      if (component.id === id) {
        return { ...component, props: { ...component.props, ...updatedProps } };
      }
      if (component.children) {
        return {
          ...component,
          children: component.children.map((child) =>
            updateComponentAndChildren(child, id, updatedProps)
          ),
        };
      }
      return component;
    };

    setComponents((prev) => {
      const updatedComponents = prev.map((component) =>
        updateComponentAndChildren(component, id, updatedProps)
      );
  
      // Assurez-vous que l'état des composants est mis à jour correctement
      return updatedComponents; // Nouvelle référence pour forcer le re-render
    });

    const componentChangé = components.map((component) =>component.id === id)
    console.log("Component changé: ", componentChangé);
  };
  

  // Supprimer un enfant d'un conteneur  
  // ***********************************************
  const removeChildRecursively = (components, containerId, childId) => {
    return components.map((component) => {
      if (component.id === containerId) {
        return {
          ...component,
          children: component.children
            ? component.children.filter((child) => child.id !== childId)
            : [],
        };
      }
  
      if (component.children && component.children.length > 0) {
        return {
          ...component,
          children: removeChildRecursively(component.children, containerId, childId),
        };
      }
      return component;
    });
  };
  // ********************************
  const removeChildFromContainer = (containerId, childId) => {
    setComponents((prevComponents) => {
      console.log("Avant suppression :", prevComponents);
      const updatedComponents = removeChildRecursively(prevComponents, containerId, childId);
      console.log("Après suppression :", updatedComponents);
      return updatedComponents;
    });
  };

  // Supprimer un parent
  // *******************
  const removeParent = (parentId) => {
    setComponents((prevComponents) => {
      // Fonction récursive pour supprimer un composant
      const removeComponentRecursively = (components) => {
        return components
          .filter((component) => component.id !== parentId) // Supprime le composant si c'est le bon ID
          .map((component) => ({
            ...component,
            children: component.children
              ? removeComponentRecursively(component.children) // Traite les enfants s'ils existent
              : [], // Sinon, retourne un tableau vide
          }));
      };
      return removeComponentRecursively(prevComponents);
    });
    setSelectedComponent(null); // Réinitialise la sélection
  };


  // Duplication récursive avec génération de nouveaux IDs
  
  // Duplication récursive avec génération de nouveaux IDs
  const cloneComponentWithNewIds = (component) => {
    const newId = `${component.type}-${nanoid()}`;

    const cloned = {
      ...component,
      id: newId,
    };

    if (component.children) {
      cloned.children = component.children.map((child) => cloneComponentWithNewIds(child));
    }

    return cloned;
  };

  // Dupliquer le composant sélectionné
  const handleDuplicate = () => {

    if (!selectedComponent) return;
  
    const duplicate = cloneComponentWithNewIds(selectedComponent);
  
    setComponents((prev) => insertAfter(prev, selectedComponent.id, duplicate));
    setSelectedComponent(null);
    
  };

  // Insérer un composant juste après l'original dans l'arbre
  const insertAfter = (list, targetId, newItem) => {
    const recursiveInsert = (arr) => {
      return arr.flatMap((item) => {
        if (item.id === targetId) {
          return [item, newItem];
        } else if (item.children) {
          return [
            {
              ...item,
              children: recursiveInsert(item.children),
            },
          ];
        }
        return [item];
      });
    };
    return recursiveInsert(list);
  };

  // Activer le mode déplacement
  const handleMoveMode = () => {
    if (!selectedComponent) return;
    setMode("move");
  };

  // Coller le composant dans le conteneur ciblé
  const handleMove = (targetContainerId) => {
    if (!selectedComponent) return;

    const movedComponent = cloneComponentWithNewIds(selectedComponent); // Nouveau clone avec nouvel ID

    const removeComponent = (list, targetId) => {
      return list.flatMap((item) => {
        if (item.id === targetId) return [];
        if (item.children) {
          return [
            {
              ...item,
              children: removeComponent(item.children, targetId),
            },
          ];
        }
        return [item];
      });
    };

    const addToTargetContainer = (list) => {
      return list.map((item) => {
        if (item.id === targetContainerId) {
          return {
            ...item,
            children: [...item.children, movedComponent],
          };
        } else if (item.children) {
          return {
            ...item,
            children: addToTargetContainer(item.children),
          };
        }
        return item;
      });
    };

    const without = removeComponent(components, selectedComponent.id);
    const updated = addToTargetContainer(without);
    setComponents(updated);
    setSelectedComponent(null);
    setMode(null);
  };
  
  // Duplication récursive avec génération de nouveaux IDs
  // Fin *************************************************
  // Duplication récursive avec génération de nouveaux IDs



  // Gestion de mise à jours *****************************
  const undo = () => {
    if (historyIndex <= 0) return;
    setHistoryIndex(i => i - 1);
    setComponents(history[historyIndex - 1]);
  };
  
  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    setHistoryIndex(i => i + 1);
    setComponents(history[historyIndex + 1]);
  };
  
  useEffect(() => {
    if (!isEqual(components, history[historyIndex])) {
      const newHistory = [...history.slice(0, historyIndex + 1), components];
      const limited = newHistory.slice(-20);
      setHistory(limited);
      setHistoryIndex(limited.length - 1);
      console.log("📦 Nouvelle version sauvegardée");
    }
  }, [components]);
  

  
  // Test Affichage
  useEffect(() => {
    console.log(
      "%cComposants actuels suite à un useEffect :", 
      "background-color: cyan; padding: 3px; color: black",components
    );
  }, [components]);
  // ********************************
  useEffect(() => {
    if (selectedComponent) {
    setLocalProps(selectedComponent.props || {}); 
  }
    console.log("%cChangement selected, localProps sont:", 
      "background-color: yellow; padding: 3px; color: black",localProps);
  }, [selectedComponent]);

  // Sélectionner un composant pour l'édition
  // ****************************************
  const selectComponent = (id) => {
    const component = components.find((comp) => comp.id === id);
    setSelectedComponent(component);
  };
  
  // RenderComponent
  // ***************
  const renderComponent = (component) => {
    // Si le composant est un conteneur (vide ou parent)
    if (component.type === "container") {
      const isContainer = component.type === "container";
      return (
        <div
          key={component.id}
          style={{
            ...component.props.style,
            border: hoveredContainerId === component.id && mode === "move" ? "2px dashed blue" : component.props.style?.border,
            cursor: isContainer ? "pointer" : "default",
          }}
          onClick={(e) => {
            setLocalProps({})
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            setMode(null);
            console.log("On click sur id:", component.id);
          }}
          onMouseEnter={() => {
            if (isContainer && mode === "move") setHoveredContainerId(component.id);
          }}
          onMouseLeave={() => {
            if (isContainer) setHoveredContainerId(null);
          }}
        >
          {component.children.length > 0 ? (
            component.children.map((child) => renderComponent(child)) // Rendu récursif des enfants
          ) : (
            <p style={{ textAlign: "center", color: "#868e96" }}>Empty</p>
          )}
          {mode === "move" && hoveredContainerId === component.id && (
            <button 
            onClick={() => handleMove(component.id)}
            >Coller ici</button>
          )}
        </div>
      );
    } else if (component.type === "text") {
      return (
        <div
          key={component.id}
          style={component.props.style}
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            setMode(null);
            console.log("Texte initié comme :", component.id);
          }}
          onMouseEnter={() => {
            if (component.type === "container" && mode === "move") setHoveredContainerId(component.id);
          }}
          onMouseLeave={() => {
            if (component.type === "container") setHoveredContainerId(null);
          }}
        >
          {component.props.text || "Child"}
        </div>
      );
    } else if (component.type === "image") {
      return (
        <img
          key={component.id}
          src={component.props.src}
          alt={component.props.alt}
          style={component.props.style}
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            setMode(null);
            console.log("Image initiée comme :", component.id);
          }}
          onMouseEnter={() => {
            if (component.type === "container" && mode === "move") setHoveredContainerId(component.id);
          }}
          onMouseLeave={() => {
            if (component.type === "container") setHoveredContainerId(null);
          }}
        />
      );
    } else if (component.type === "video") {
      return (
        <video
          key={component.id}
          src={component.props.src}
          controls={true}
          autoPlay={true}
          playsInline={true}
          style={component.props.style}
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            setMode(null);
            console.log("Vidéo initiée comme :", component.id);
          }}
          onMouseEnter={() => {
            if (component.type === "container" && mode === "move") setHoveredContainerId(component.id);
          }}
          onMouseLeave={() => {
            if (component.type === "container") setHoveredContainerId(null);
          }}
        />
      );
    } else if (component.type === "link") {
      return (
        <a
          key={component.id}
          href={component.props.href}
          style={{ textDecoration: "none" }}
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            setMode(null);
            console.log("Lien initié comme :", component.id);
          }}
          onMouseEnter={() => {
            if (component.type === "container" && mode === "move") setHoveredContainerId(component.id);
          }}
          onMouseLeave={() => {
            if (component.type === "container") setHoveredContainerId(null);
          }}
        >
          {renderComponent(component.props.children)}
        </a>
      );
    } else if (component.type === "button") {
      return (
        <button
          key={component.id}
          style={component.props.style}
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            setMode(null);
            console.log("Bouton initié comme :", component.id);
          }}
          onMouseEnter={() => {
            if (component.type === "container" && mode === "move") setHoveredContainerId(component.id);
          }}
          onMouseLeave={() => {
            if (component.type === "container") setHoveredContainerId(null);
          }}
        >
          {component.props.children}
        </button>
      );
    } else {
      return (
        <div
          key={component.id}
          style={component?.props?.style}
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            setMode(null);
            console.log("Composant initié comme :", component.id);
          }}
          onMouseEnter={() => {
            if (component.type === "container" && mode === "move") setHoveredContainerId(component.id);
          }}
          onMouseLeave={() => {
            if (component.type === "container") setHoveredContainerId(null);
          }}
        >
          {component.props.text || "Child"}
        </div>
      );
    }
  };
  // ***************** Fin Ajout des fonctionnalités ***************** //
  // **********************                    ********************** //

  useEffect(() => {
    if (selectedComponent) {
      const style = selectedComponent.props?.style || {};
      const filled = {};
      cssFields.forEach((key) => {
        filled[key] = style[key] || "";
      });
      setLocalStyle(filled);
    }
  }, [selectedComponent]);


  // ***************** Debut Edition des Properties ***************** //
  // **********************                    ********************** //
  // Editeur de propriétés
  // *******************
  const PropertyEditor = () => {
    if (!selectedComponent) return <div>Sélectionnez un composant pour modifier ses propriétés</div>;

    const applyUpdatedProp = (key, value, isStyle = false) => {
      if (!selectedComponent?.id) return;
    
      const cleanedValue = typeof value === "string" ? value.trim() : value;
      let updatedProps;

      if (isStyle) {
        const cleanedStyle = {
          ...selectedComponent.props?.style,
          [key]: cleanedValue,
        };

        // On supprime les propriétés avec une chaîne vide
        Object.keys(cleanedStyle).forEach((k) => {
          if (cleanedStyle[k]?.toString().trim() === "") delete cleanedStyle[k];
        });

        updatedProps = {
          ...selectedComponent.props,
          style: cleanedStyle,
        };
      } else {
        updatedProps = {
          ...selectedComponent.props,
          [key]: cleanedValue,
        };
      }

      updateComponentProps(selectedComponent.id, updatedProps);

      // MAJ localProps et localStyle aussi
      setLocalProps((prev) =>
        isStyle
          ? {
              ...prev,
              style: {
                ...(prev?.style || {}),
                [key]: cleanedValue,
              },
            }
          : {
              ...prev,
              [key]: cleanedValue,
            }
      );

      if (isStyle) {
        setLocalStyle((prev) => ({ ...prev, [key]: cleanedValue }));
      }
      
    };
    
    
    // Gestion des modifications locales
    
    // Gestion des styles à jour dans localProps

    // Appele à la Mise à jour de Props d'un component via la localProps
    const handlePropsBlur = (property) => {
      if (selectedComponent) {
        updateComponentProps(selectedComponent.id, { [property]: localProps[property] });
      }
    };
    
    // Application de changement des styles CSS imbriqué
    const handleStyleBlur = (property) => {
      const cleanedStyle = {};
      Object.entries(localStyle).forEach(([key, value]) => {
        if (value.trim() !== "") {
          cleanedStyle[key] = value;
        }
      });
      console.log("handleStyleBlur Style in Comps");
      updateComponentProps(selectedComponent.id, {
        style: cleanedStyle,
      });
    };

    // Ajout des styles
    const handleAddStyle = (key, value) => {
      if (key && value !== undefined) {
        setLocalProps((prev) => ({
          ...prev,
          style: {
            ...prev.style,
            [key]: value,
          },
        }));
        updateComponentProps(selectedComponent.id, {
          style: {
            ...localProps.style,
            [key]: value,
          },
        });
      }
    };
    // Fonction pour ajouter une nouvelle propriété
    const handleAddProperty = (key, value) => {
      if (key && value !== undefined) {
        updateComponentProps(selectedComponent.id, { [key]: value });
      }
    };

    const getPlaceholder = (field) => {
      switch (field) {
        case "padding":
        case "margin":
          return "20px";
        case "backgroundColor":
        case "color":
          return "#f1f1f1";
        case "fontSize":
          return "16px";
        case "display":
          return "flex, block...";
        case "justifyContent":
          return "center, space-between...";
        case "alignItems":
          return "center, stretch...";
        case "textAlign":
          return "center, left...";
        case "gap":
          return "10px";
        case "border":
          return "1px solid #000";
        case "borderRadius":
          return "8px";
        case "width":
        case "height":
          return "100px, 100%";
        default:
          return "";
      }
    }

    return (
      <div>
        <div>
          <h3>Editeur</h3>
          <hr></hr>
          <h4>Contenaire</h4>
          <button
            onClick={() => removeParent(selectedComponent.id)}
            style={{ marginLeft: "10px", backgroundColor: "#a0440f", color: "white",
              width: "90%", padding: "3px 4px", fontSize: "12px",
              border: "1px solid  #ced4da", borderRadius: "4px", marginTop: "4px",
             }}
          >
            Supprimer ce conteneur
          </button>
        </div>

        {/* Gestion des enfants */}
        {selectedComponent.children && selectedComponent.children.length > 0 && (
          <div style={{marginLeft: "10px"}}>
            <h4>Sous contenaires</h4>
            {selectedComponent.children.map((child) => (
              <div key={child.id} style={{ marginBottom: "5px" }}>
                <span>*{child.props.text || child.type}</span>
                <button
                  onClick={() => removeChildFromContainer(selectedComponent.id, child.id)}
                  style={{ marginLeft: "20px", backgroundColor: "#a0440f", color: "white",
                    width: "80%", padding: "3px 4px", fontSize: "12px",
                    border: "1px solid #ced4da", borderRadius: "4px", marginTop: "4px",
                  }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <h3>Move</h3>
          <div style={{ marginBottom: 10 }}>
            <button 
            onClick={handleDuplicate}
            disabled={!selectedComponent}
            style={{ marginLeft: "20px", backgroundColor: "#e4eb8e", color: "black",
              width: "80%", padding: "3px 4px", fontSize: "12px",
              border: "1px solid #ced4da", borderRadius: "4px", marginTop: "4px",
            }}
            >
              Dupliquer
            </button>
            <button 
            onClick={handleMoveMode} 
            disabled={!selectedComponent}
            style={{ marginLeft: "20px", backgroundColor: "#e4eb8e", color: "black",
              width: "80%", padding: "3px 4px", fontSize: "12px",
              border: "1px solid #ced4da", borderRadius: "4px", marginTop: "4px",
            }}
            >
              Déplacer
            </button>
          </div>
        </div>


        {/* Affichage des propriétés existantes */}
        {localProps && typeof localProps === "object" && Object.keys(localProps).length > 0 ? (
          <div style={{ marginTop: "20px",}}>
            <h3>Props de {selectedComponent.type}</h3>
            <hr></hr>
            {Object.keys(localProps).map((key) =>
              key !== "style" ? (
                <div key={key}>
                  <label>{key}: </label>
                  <input
                    type="text"
                    defaultValue={localProps[key] || ""}
                    onBlur={(e) => {
                      applyUpdatedProp(key, e.target.value, false);
                    }}

                    style={{
                      width: "80%",
                      padding: "6px 8px",
                      fontSize: "12px",
                      // border: "1px solid #ced4da",
                      borderRadius: "4px",
                      marginTop: "4px",
                      backgroundColor: "black",
                      color:"white",
                    }}
                  />
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p>Aucune propriété modifiable</p>
        )}

        {/* Bi-New */}
        <div style={{ padding: "1rem", borderLeft: "1px solid #dee2e6", minWidth: "250px" }}>
        <h3 style={{ fontSize: "16px", marginBottom: "1rem" }}>CSS</h3>
        {cssFields.map((field) => (
          <div key={field} style={{ marginBottom: "10px"}}>
            <label style={{ fontSize: "12px", color: "#fff" }}>{field}</label> <br></br>
            <input
              type="text"
              placeholder={`ex: ${getPlaceholder(field)}`}
              defaultValue={localStyle[field]}
              onBlur={(e) => {
                applyUpdatedProp(field, e.target.value, true)
              }}
              style={{
                width: "50%",
                minWidth: "150px",
                padding: "6px 8px",
                fontSize: "12px",
                // border: "1px solid #ced4da",
                borderRadius: "4px",
                marginTop: "4px",
                backgroundColor: "black",
                color:"white",
              }}
            />
          </div>
        ))}
      </div>
        {/* Bi-New */}

        {/* Modifier les styles */}
        

        {/* Ajouter une nouvelle propriété */}
        <div>
          <h3>Ajouter props :</h3>
          <input
            type="text"
            placeholder="Nom de la propriété (ex: background-color)"
            id="property-name"
            style={{ marginLeft: "10px", backgroundColor: "black", color: "white",
              width: "80%", padding: "6px 4px", fontSize: "12px",
              border: "1px solid #ced4da", borderRadius: "4px", marginTop: "4px",
            }}
          />
          <input
            type="text"
            placeholder="Valeur de la propriété (ex: #fff)"
            id="property-value"
            style={{ marginLeft: "10px", backgroundColor: "black", color: "white",
              width: "80%", padding: "6px 4px", fontSize: "12px",
              border: "1px solid #ced4da", borderRadius: "4px", marginTop: "4px",
            }}
          />
          <button
            onClick={() => {
              const name = document.getElementById("property-name").value;
              const value = document.getElementById("property-value").value;
              handleAddProperty(name, value);
              document.getElementById("property-name").value = "";
              document.getElementById("property-value").value = "";
            }}
            style={{ marginLeft: "20px", backgroundColor: "#e4eb8e", color: "black",
              width: "80%", padding: "3px 4px", fontSize: "12px",
              border: "1px solid #ced4da", borderRadius: "4px", marginTop: "4px",
            }}

          >
            Ajouter
          </button>
        </div>

        {/* Ajouter un nouveau style */}
        <div>
          <h3>Ajouter CSS :</h3>
          <input
            type="text"
            placeholder="Nom du style (ex: background-color)"
            id="style-name"
            style={{ marginLeft: "10px", backgroundColor: "black", color: "white",
              width: "80%", padding: "6px 4px", fontSize: "12px",
              border: "1px solid #ced4da", borderRadius: "4px", marginTop: "4px",
            }}
          />
          <input
            type="text"
            placeholder="Valeur du style (ex: #fff)"
            id="style-value"
            style={{ marginLeft: "10px", backgroundColor: "black", color: "white",
              width: "80%", padding: "6px 4px", fontSize: "12px",
              border: "1px solid #ced4da", borderRadius: "4px", marginTop: "4px",
            }}
          />
          <button
            onClick={() => {
              const name = document.getElementById("style-name").value;
              const value = document.getElementById("style-value").value;
              handleAddStyle(name, value);
              document.getElementById("style-name").value = "";
              document.getElementById("style-value").value = "";
            }}
            style={{ marginLeft: "20px", backgroundColor: "#e4eb8e", color: "black",
              width: "80%", padding: "3px 4px", fontSize: "12px",
              border: "1px solid #ced4da", borderRadius: "4px", marginTop: "4px",
            }}
          >
            Ajouter style
          </button>
        </div>

        {/* Gestion des images */}
        {selectedComponent.type === "image" && (
          <div>
            <h4>SpcImg Modifier les propriétés de l'image</h4>
            <div>
              <label>Source :</label>
              <input type="text" placeholder="URL de l'image" value={localProps?.src || ""} onBlur={(e) => applyUpdatedProp("src", e.target.value)} />
            </div>
            <div>
              <label>Largeur :</label>
              <input type="text" placeholder="100% ou 200px" value={localProps?.width || ""} onBlur={(e) => applyUpdatedProp("width", e.target.value, true)} />
            </div>
            <div>
              <label>Hauteur :</label>
              <input type="text" placeholder="auto ou 200px" value={localProps?.height || ""} onBlur={(e) => applyUpdatedProp("height", e.target.value, true)} />
            </div>
            <div>
              <label>Object-fit :</label>
              <select value={localProps?.objectFit || "cover"} onBlur={(e) => applyUpdatedProp("objectFit", e.target.value)} >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
              <option value="none">None</option>
              <option value="scale-down">Scale-down</option>
            </select>
            </div>
          </div>
        )}

        {/* Gestion des vidéos */}
        {selectedComponent.type === "video" && (
          <div>
            <h4>SpcVideo Modifier les propriétés de la vidéo</h4>
            <div>
              <label>Source :</label>
              <input type="text" placeholder="URL de la video" value={localProps?.src || ""} onBlur={(e) => applyUpdatedProp("src", e.target.value)} />
            </div>
            <div>
              <label>Largeur :</label>
              <input type="text" placeholder="100% ou 200px" value={localProps?.width || ""} onBlur={(e) => applyUpdatedProp("width", e.target.value, true)} />
            </div>
            <div>
              <label>Hauteur :</label>
              <input type="text" placeholder="auto ou 200px" value={localProps?.height || ""} onBlur={(e) => applyUpdatedProp("height", e.target.value, true)} />
            </div>
            <div>
              <label>Contrôles :</label>
              <select value={localProps?.controls ? "true" : "false"} onBlur={(e) => applyUpdatedProp("controls", e.target.value === "true")} >
                <option value="true">Activé</option>
                <option value="false">Désactivé</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };
  // ***************** Fin Edition des Properties ***************** //
  // **********************                    ********************** //

  // ***************** Debut Liste Contenair ***************** //
  // *****************                    ***************** //
  const ListeContenair= ()=>{
    return( 
      <>
        <div style={{ display: "flex", gap: "20px", backgroundColor:"#333", padding: 24, borderRadius: 25 }}>
          <div style={{ flex: 1 }}>
            <h1>Container Editor</h1>
            <Container onAddContainer={handleAddContainer} />
          </div>
        </div>
      </>
    )
  }
  // ***************** Fin Liste Contenair ***************** //
  // *****************                    ***************** //


  // ***************** Debut Liste Header ***************** //
  // *****************                    ***************** //
  const AddHeaders = () => {  
    const handleAddHeader = (template) => {
      const newHeader = {
        ...template,
        id: `header-${nanoid()}`,
        children: template.children.map((child) => ({
          ...child,
          id: `${child.id}-${nanoid()}`,
          children: child.children.map((grandchild) => ({
            ...grandchild,
            id: `${grandchild.id}-${nanoid()}`,
          })),
        })),
      };
      setComponents((prev) => [...prev, newHeader]);
    };  
    return (
      <div>
        <h1>Header Editor</h1>
        {/* <Header onAddHeader={handleAddHeader} /> */}
        <Header onAddContainer={handleAddContainer} />
      </div>
    );
  };
  // ***************** Fin Liste Header ***************** //
  // *****************                    ***************** //
  return (
    <div>
      <div className="projet-maker">

        {/* /**************************************** projet-maker right ******************************* */}
        <div className={isShown ? 'show container-rigth-projet-maker' : 'container-rigth-projet-maker'}>
          <div className="projet-maker-userProfil">
            <span className="projet-maker-userProfil-imgs">
              {userProfil.role=="admin" ?
                <img src="https://i.pinimg.com/originals/ce/e6/75/cee675d2ceba4f3470a219c88a69aef6.jpg" width={50} className="userProfilImg" alt="Boss"/> :
                 <img src="https://i.pinimg.com/originals/ce/e6/75/cee675d2ceba4f3470a219c88a69aef6.jpg" width={50} className="userProfilImg" alt="Gerant"/>
              }
            </span>
            <span className="projet-maker-userProfil-info">
              <span>{userProfil.username}</span>
              <span className='projet-maker-userProfil-info-text'>{userProfil.role}</span>
            </span>
          </div>

          <div className="container-rigth-projet-maker-links">

            <NavLink onClick={() => handleComponentChange()}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Run</span>
            </NavLink >

            <NavLink onClick={() => handleComponentChange(<ListeContenair />)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Add</span>
            </NavLink >

            <NavLink onClick={() => handleComponentChange(<PropertyEditor />)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>PropertyEditor</span>
            </NavLink >

            <NavLink onClick={() => handleComponentChange(<AddHeaders />)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>AddHeader</span>
            </NavLink >

            <NavLink onClick={() => handleComponentChange(<Label />)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Formulaire</span>
            </NavLink >

            <NavLink  to="/Div">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Design conseil</span>
            </NavLink >

            <NavLink  to="/Label">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Tutoriels</span>
            </NavLink >

            <NavLink  to="/ZoneText" activeClassName="active-link">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Deployement</span>
            </NavLink >

          </div>
          <div className="container-rigth-projet-maker-links spaceTop">
            <NavLink  to="/" className="ButtonPage">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Optimist SEO</span>
            </NavLink >
          </div>
                    
        </div>

        {/* /**************************************** projet-maker Center ******************************* */}
        <div className="container-middle-projet-maker">
          <div className='container-middle-projet-maker-header'>
            <div className="container-middle-projet-maker-textLogo">
              <h1>Digilia FrameRendu</h1>
              <h3>NetKin</h3>  
            </div>   
            <div className="container-middle-projet-maker-header-rigth">
              <span className="container-middle-projet-maker-header-rigth-imgs">
                  <img src="https://i.pinimg.com/originals/ce/e6/75/cee675d2ceba4f3470a219c88a69aef6.jpg" width={50} className="container-middle-projet-maker-header-rigth-img" alt="logo"/> 
              </span>
              <span className="container-middle-projet-maker-header-rigth-info">
                <span className='container-middle-projet-maker-header-rigth-info-text'>Projet 3</span>
              </span>
            </div>
          </div>
          
          <button onClick={toggleContainerRigthProjetMaker} className={isShown ? 'container-middle-projet-maker-content-buttonMenu active' : 'container-middle-projet-maker-content-buttonMenu'}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff"><path d="M666-440 440-666l226-226 226 226-226 226Zm-546-80v-320h320v320H120Zm400 400v-320h320v320H520Zm-400 0v-320h320v320H120Zm80-480h160v-160H200v160Zm467 48 113-113-113-113-113 113 113 113Zm-67 352h160v-160H600v160Zm-400 0h160v-160H200v160Zm160-400Zm194-65ZM360-360Zm240 0Z"/></svg>
          </button>
          <div className="container-middle-projet-maker-content">
            {/* <FrameRendu className="framerendu"/> */}
            {/* Debut New Struct */}
            <div>
              {components.map((component) => renderComponent(component))}
            </div>
            {/* Fin New Struct */}
          </div>

          {/* <Rnd
            default={{
              x: 0,
              y: 0,
              width: 520,
              height: 200,
            }}
            minWidth={200}
            minHeight={100}
            bounds="window"
          >
          </Rnd> */}
          <Rnd
            size={{ width: size.width, height: size.height }}
            position={{ x: position.x, y: position.y }}
            onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) => {
              setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
              setPosition(position);
            }}
            minWidth={600}
            minHeight={400}
            bounds="window"
            className='activeComponent'
            style={{
              // background: "white",
              border: "1px solid #ccc", padding: "20px", display:isShownActiveComponent,
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            <button onClick={toggleActiveComponent}>Close frame</button>
            {activeComponent}
          </Rnd>
          
        </div>
        
        {/* /**************************************** projet-maker left ******************************* */}
        <div className={isShown ? 'show container-left-projet-maker' : 'container-left-projet-maker'}>
          <div className='properties'>
          <h3>Historique</h3>
          <div style={{marginBottom: "10px"}}>
            <button onClick={undo} disabled={historyIndex === 0}>⬅️</button>
            <button onClick={redo} disabled={historyIndex === history.length - 1}>➡️</button>
          </div>
            <PropertyEditor/>
          </div>  
        </div>
      </div>
    </div>
  );
  
};

export default ProjetPage;
