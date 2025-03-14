
import React, { useState, useEffect} from 'react';
import { Rnd } from "react-rnd";
import Container from "../projetMakerCentral/components/Container";
import Header from "../projetMakerCentral/components/Header";
import Label from '../Dashboard';
import './ProjetMaker.css';
import { Link, NavLink  } from 'react-router-dom';import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

const userString = localStorage.getItem('digiliaUser');
const userProfil = JSON.parse(userString);
// console.log(userProfil);

const ProjetPage = () => {
  const [activeComponent, setActiveComponent] = useState(""); // Par défaut, le composant Home est affiché
  // ********************** Debut Route d"Affichage ********************** //
  // **********************                    ********************** //
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
  const storedComponents = JSON.parse(localStorage.getItem('components') || []);
  const [components, setComponents] = useState(storedComponents);
  const [selectedComponent, setSelectedComponent] = useState(null);
  useEffect(() => {
      localStorage.setItem("components", JSON.stringify(components));
    }, [components]);

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
      console.log('Sected:', selectedComponent);
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
  const updateComponentProps = (id, updatedProps) => {
    setComponents((prev) =>
      prev.map((component) =>
        component.id === id
          ? {
              ...component,
              props: { ...component.props, ...updatedProps },
            }
          : component
      )
    );
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
    // console.log("existe:", parentId);
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
  
  // Test Affichage
  useEffect(() => {
    console.log(
      "%cComposants actuels:", 
      "background-color: cyan; padding: 3px; color: black",components
    );
  }, [components]);
  // ****************

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
      return (
        <div
          key={component.id}
          style={{
            ...component.props.style,
            border: "1px dashed #adb5bd",
            marginBottom: "10px",
            cursor: "pointer",
          }}
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            console.log("Initié comme :", component.id);
          }}
        >
          {component.children.length > 0 ? (
            component.children.map((child) => renderComponent(child)) // Rendu récursif des enfants
          ) : (
            <p style={{ textAlign: "center", color: "#868e96" }}>Empty</p>
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
            console.log("Texte initié comme :", component.id);
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
            console.log("Image initiée comme :", component.id);
          }}
        />
      );
    } else if (component.type === "video") {
      return (
        <video
          key={component.id}
          src={component.props.src}
          controls
          style={component.props.style}
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            console.log("Vidéo initiée comme :", component.id);
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
            console.log("Lien initié comme :", component.id);
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
            console.log("Bouton initié comme :", component.id);
          }}
        >
          {component.props.children}
        </button>
      );
    } else {
      return (
        <div
          key={component.id}
          style={component.props.style}
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            console.log("Composant initié comme :", component.id);
          }}
        >
          {component.props.text || ""}
        </div>
      );
    }
  };



  // ***************** Fin Ajout des fonctionnalités ***************** //
  // **********************                    ********************** //

  // ***************** Debut Edition des Properties ***************** //
  // **********************                    ********************** //
  // Editeur de propriétés
  // *******************
  const PropertyEditor = () => {
    if (!selectedComponent) return <div>Sélectionnez un composant pour modifier ses propriétés</div>;

    // Fonction pour modifier les propriétés du composant
    const handlePropertyChange = (property, value) => {
      updateComponentProps(selectedComponent.id, { [property]: value });
    };

    // Fonction pour ajouter une nouvelle propriété
    const handleAddProperty = (key, value) => {
      if (key && value !== undefined) {
        updateComponentProps(selectedComponent.id, { [key]: value });
      }
    };

    return (
      <div>
        <div>
          <h4>Actions</h4>
          <button
            onClick={() => removeParent(selectedComponent.id)}
            style={{ backgroundColor: "red", color: "white", margin: "5px" }}
          >
            Supprimer ce conteneur
          </button>
        </div>
        {selectedComponent.children.length > 0 && (
          <div>
            <h4>Gérer les enfants</h4>
            {selectedComponent.children.map((child) => (
              <div key={child.id} style={{ marginBottom: "5px" }}>
                <span>{child.props.text || child.type}</span>
                <button
                  onClick={() => removeChildFromContainer(selectedComponent.id, child.id)}
                  style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}

        <h3>Modifier les propriétés de {selectedComponent.type}</h3>

        {/* Affichage des propriétés existantes */}
        {Object.keys(selectedComponent.props).map((key) => (
          <div key={key}>
            <label>{key}: </label>
            <input
              type="text"
              value={selectedComponent.props[key]}
              onChange={(e) => handlePropertyChange(key, e.target.value)}
            />
          </div>
        ))}

        {/* Ajouter une nouvelle propriété */}
        <div>
          <label>Ajouter une nouvelle propriété :</label>
          <input
            type="text"
            placeholder="Nom de la propriété (ex: background-color)"
            id="property-name"
          />
          <input
            type="text"
            placeholder="Valeur de la propriété (ex: #fff)"
            id="property-value"
          />
          <button
            onClick={() => {
              const name = document.getElementById("property-name").value;
              const value = document.getElementById("property-value").value;
              handleAddProperty(name, value);
              document.getElementById("property-name").value = "";
              document.getElementById("property-value").value = "";
            }}
          >
            Ajouter
          </button>
        </div>

        {/* Modifications de texte (taille, police, etc.) */}
        {selectedComponent.type === "text" && (
          <div>
            <h4>Modifier les propriétés de texte</h4>
            <div>
              <label>Taille du texte (en px) :</label>
              <input
                type="number"
                value={selectedComponent.props.fontSize || ""}
                onChange={(e) => handlePropertyChange("fontSize", e.target.value)}
              />
            </div>
            <div>
              <label>Police :</label>
              <input
                type="text"
                value={selectedComponent.props.fontFamily || ""}
                onChange={(e) => handlePropertyChange("fontFamily", e.target.value)}
              />
              <button
                onClick={() => {
                  const font = prompt("Entrez le nom de la police ou choisissez une Google Font");
                  handlePropertyChange("fontFamily", font);
                }}
              >
                Ajouter Google Font
              </button>
            </div>
          </div>
        )}

        {/* Gestion des images */}
        {selectedComponent.type === "image" && (
          <div>
            <h4>Modifier les propriétés de l'image</h4>
            <div>
              <label>Source :</label>
              <input
                type="text"
                placeholder="URL de l'image"
                value={selectedComponent.props.src || ""}
                onChange={(e) => handlePropertyChange("src", e.target.value)}
              />
            </div>
            <div>
              <label>Largeur :</label>
              <input
                type="text"
                placeholder="100% ou 200px"
                value={selectedComponent.props.width || ""}
                onChange={(e) => handlePropertyChange("width", e.target.value)}
              />
            </div>
            <div>
              <label>Hauteur :</label>
              <input
                type="text"
                placeholder="auto ou 200px"
                value={selectedComponent.props.height || ""}
                onChange={(e) => handlePropertyChange("height", e.target.value)}
              />
            </div>
            <div>
              <label>Object-fit :</label>
              <select
                value={selectedComponent.props.objectFit || "cover"}
                onChange={(e) => handlePropertyChange("objectFit", e.target.value)}
              >
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
            <h4>Modifier les propriétés de la vidéo</h4>
            <div>
              <label>Source :</label>
              <input
                type="text"
                placeholder="URL de la vidéo"
                value={selectedComponent.props.src || ""}
                onChange={(e) => handlePropertyChange("src", e.target.value)}
              />
            </div>
            <div>
              <label>Largeur :</label>
              <input
                type="text"
                placeholder="100% ou 200px"
                value={selectedComponent.props.width || ""}
                onChange={(e) => handlePropertyChange("width", e.target.value)}
              />
            </div>
            <div>
              <label>Hauteur :</label>
              <input
                type="text"
                placeholder="auto ou 200px"
                value={selectedComponent.props.height || ""}
                onChange={(e) => handlePropertyChange("height", e.target.value)}
              />
            </div>
            <div>
              <label>Contrôles :</label>
              <select
                value={selectedComponent.props.controls ? "true" : "false"}
                onChange={(e) => handlePropertyChange("controls", e.target.value === "true")}
              >
                <option value="true">Activé</option>
                <option value="false">Désactivé</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  // const PropertyEditor = () => {
  //   if (!selectedComponent) return <div>Sélectionnez un composant pour modifier ses propriétés</div>;

  //   // Fonction pour modifier les propriétés du composant
  //   const handlePropertyChange = (property, value) => {
  //     updateComponentProps(selectedComponent.id, { [property]: value });
  //   };

  //   // Fonction pour ajouter une nouvelle propriété
  //   const handleAddProperty = (key, value) => {
  //     if (key && value !== undefined) {
  //       updateComponentProps(selectedComponent.id, { [key]: value });
  //     }
  //   };

  //   // Fonction pour ajouter une classe CSS prédéfinie
  //   const handleAddClass = (className) => {
  //     updateComponentProps(selectedComponent.id, { className });
  //   };

  //   return (
  //     <div>
  //       <div>
  //         <h4>Actions</h4>
  //         <button
  //           onClick={() => removeParent(selectedComponent.id)}
  //           style={{ backgroundColor: "red", color: "white", margin: "5px" }}
  //         >
  //           Supprimer ce conteneur
  //         </button>
  //       </div>
  //       {selectedComponent.children.length > 0 && (
  //         <div>
  //           <h4>Gérer les enfants</h4>
  //           {selectedComponent.children.map((child) => (
  //             <div key={child.id} style={{ marginBottom: "5px" }}>
  //               <span>{child.props.text || child.type}</span>
  //               <button
  //                 onClick={() => removeChildFromContainer(selectedComponent.id, child.id)}
  //                 style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
  //               >
  //                 Supprimer
  //               </button>
  //             </div>
  //           ))}
  //         </div>
  //       )}

  //       <h3>Modifier les propriétés de {selectedComponent.type}</h3>

  //       {/* Affichage des propriétés existantes */}
  //       {Object.keys(selectedComponent.props).map((key) => (
  //         <div key={key}>
  //           <label>{key}: </label>
  //           <input
  //             type="text"
  //             value={selectedComponent.props[key]}
  //             onChange={(e) => handlePropertyChange(key, e.target.value)}
  //           />
  //         </div>
  //       ))}

  //       {/* Ajouter une nouvelle propriété */}
  //       <div>
  //         <label>Ajouter une nouvelle propriété :</label>
  //         <input
  //           type="text"
  //           placeholder="Nom de la propriété (ex: background-color)"
  //           id="property-name"
  //         />
  //         <input
  //           type="text"
  //           placeholder="Valeur de la propriété (ex: #fff)"
  //           id="property-value"
  //         />
  //         <button
  //           onClick={() => {
  //             const name = document.getElementById("property-name").value;
  //             const value = document.getElementById("property-value").value;
  //             handleAddProperty(name, value);
  //             document.getElementById("property-name").value = "";
  //             document.getElementById("property-value").value = "";
  //           }}
  //         >
  //           Ajouter
  //         </button>
  //       </div>

  //       {/* Modifications de texte (taille, police, etc.) */}
  //       {selectedComponent.type === "text" && (
  //         <div>
  //           <h4>Modifier les propriétés de texte</h4>
  //           <div>
  //             <label>Taille du texte (en px) :</label>
  //             <input
  //               type="number"
  //               value={selectedComponent.props.fontSize || ""}
  //               onChange={(e) => handlePropertyChange("fontSize", e.target.value)}
  //             />
  //           </div>
  //           <div>
  //             <label>Police :</label>
  //             <input
  //               type="text"
  //               value={selectedComponent.props.fontFamily || ""}
  //               onChange={(e) => handlePropertyChange("fontFamily", e.target.value)}
  //             />
  //             <button
  //               onClick={() => {
  //                 const font = prompt("Entrez le nom de la police ou choisissez une Google Font");
  //                 handlePropertyChange("fontFamily", font);
  //               }}
  //             >
  //               Ajouter Google Font
  //             </button>
  //           </div>
  //         </div>
  //       )}

  //       {/* Gestion des images */}
  //       {selectedComponent.type === "image" && (
  //         <div>
  //           <h4>Modifier les propriétés de l'image</h4>
  //           <div>
  //             <label>Source :</label>
  //             <input
  //               type="text"
  //               placeholder="URL de l'image"
  //               value={selectedComponent.props.src || ""}
  //               onChange={(e) => handlePropertyChange("src", e.target.value)}
  //             />
  //           </div>
  //           <div>
  //             <label>Largeur :</label>
  //             <input
  //               type="text"
  //               placeholder="100% ou 200px"
  //               value={selectedComponent.props.width || ""}
  //               onChange={(e) => handlePropertyChange("width", e.target.value)}
  //             />
  //           </div>
  //           <div>
  //             <label>Hauteur :</label>
  //             <input
  //               type="text"
  //               placeholder="auto ou 200px"
  //               value={selectedComponent.props.height || ""}
  //               onChange={(e) => handlePropertyChange("height", e.target.value)}
  //             />
  //           </div>
  //           <div>
  //             <label>Object-fit :</label>
  //             <select
  //               value={selectedComponent.props.objectFit || "cover"}
  //               onChange={(e) => handlePropertyChange("objectFit", e.target.value)}
  //             >
  //               <option value="cover">Cover</option>
  //               <option value="contain">Contain</option>
  //               <option value="fill">Fill</option>
  //               <option value="none">None</option>
  //               <option value="scale-down">Scale-down</option>
  //             </select>
  //           </div>
  //         </div>
  //       )}

  //       {/* Gestion des vidéos */}
  //       {/* Gestion des vidéos */}
  // {selectedComponent.type === "video" && (
  //   <div>
  //     <h4>Modifier les propriétés de la vidéo</h4>
  //     <div>
  //       <label>Source :</label>
  //       <input
  //         type="text"
  //         placeholder="URL de la vidéo"
  //         value={selectedComponent.props.src || ""}
  //         onChange={(e) => handlePropertyChange("src", e.target.value)}
  //       />
  //     </div>
  //     <div>
  //       <label>Largeur :</label>
  //       <input
  //         type="text"
  //         placeholder="100% ou 200px"
  //         value={selectedComponent.props.width || ""}
  //         onChange={(e) => handlePropertyChange("width", e.target.value)}
  //       />
  //     </div>
  //     <div>
  //       <label>Hauteur :</label>
  //       <input
  //         type="text"
  //         placeholder="auto ou 200px"
  //         value={selectedComponent.props.height || ""}
  //         onChange={(e) => handlePropertyChange("height", e.target.value)}
  //       />
  //     </div>
  //     <div>
  //       <label>Contrôles :</label>
  //       <select
  //         value={selectedComponent.props.controls ? "true" : "false"}
  //         onChange={(e) => handlePropertyChange("controls", e.target.value === "true")}
  //       >
  //         <option value="true">Activé</option>
  //         <option value="false">Désactivé</option>
  //       </select>
  //     </div>
  //   </div>
  // )}

  // {/* Gestion des liens */}
  // {selectedComponent.type === "link" && (
  //   <div>
  //     <h4>Modifier les propriétés du lien</h4>
  //     <div>
  //       <label>Texte du lien :</label>
  //       <input
  //         type="text"
  //         placeholder="Texte du lien"
  //         value={selectedComponent.props.text || ""}
  //         onChange={(e) => handlePropertyChange("text", e.target.value)}
  //       />
  //     </div>
  //     <div>
  //       <label>URL du lien :</label>
  //       <input
  //         type="text"
  //         placeholder="URL du lien"
  //         value={selectedComponent.props.href || ""}
  //         onChange={(e) => handlePropertyChange("href", e.target.value)}
  //       />
  //     </div>
  //   </div>
  // )}

  // {/* Gestion des boutons */}
  // {selectedComponent.type === "button" && (
  //   <div>
  //     <h4>Modifier les propriétés du bouton</h4>
  //     <div>
  //       <label>Texte du bouton :</label>
  //       <input
  //         type="text"
  //         placeholder="Texte du bouton"
  //         value={selectedComponent.props.children || ""}
  //         onChange={(e) => handlePropertyChange("children", e.target.value)}
  //       />
  //     </div>
  //     <div>
  //       <label>Largeur :</label>
  //       <input
  //         type="text"
  //         placeholder="Largeur"
  //         value={selectedComponent.props.style.width || ""}
  //         onChange={(e) => handlePropertyChange("style.width", e.target.value)}
  //       />
  //     </div>
  //     <div>
  //       <label>Hauteur :</label>
  //       <input
  //         type="text"
  //         placeholder="Hauteur"
  //         value={selectedComponent.props.style.height || ""}
  //         onChange={(e) => handlePropertyChange("style.height", e.target.value)}
  //       />
  //     </div>
  //   </div>
  // )}

  // {/* Gestion des arrière-plans */}
  // <div>
  //   <h4>Modifier l'arrière-plan</h4>
  //   <div>
  //     <label>Type d'arrière-plan :</label>
  //     <select
  //       onChange={(e) => {
  //         const value = e.target.value;
  //         if (value === "none") {
  //           handlePropertyChange("background", "none");
  //         } else if (value === "color") {
  //           const color = prompt("Entrez la couleur de fond (ex: #fff)");
  //           handlePropertyChange("background", color);
  //         } else if (value === "image") {
  //           const imageUrl = prompt("Entrez l'URL de l'image de fond");
  //           handlePropertyChange("background", `url(${imageUrl})`);
  //         } else if (value === "video") {
  //           const videoUrl = prompt("Entrez l'URL de la vidéo de fond");
  //           handlePropertyChange("background", `url(${videoUrl})`);
  //           handlePropertyChange("backgroundSize", "cover");
  //         }
  //       }}
  //     >
  //       <option value="none">None</option>
  //       <option value="color">Couleur</option>
  //       <option value="image">Image</option>
  //       <option value="video">Vidéo</option>
  //     </select>
  //   </div>
  // </div>

  // {/* Ajouter une classe prédéfinie */}
  // <div>
  //   <h4>Ajouter une classe prédéfinie</h4>
  //   <div>
  //     <label>Classe :</label>
  //     <select
  //       onChange={(e) => handleAddClass(e.target.value)}
  //     >
  //       <option value="">Sélectionner une classe</option>
  //       <option value="hover-blur">Hover Blur</option>
  //       <option value="hover-zoom">Hover Zoom</option>
  //       <option value="hover-shadow">Hover Shadow</option>
  //     </select>
  //   </div>
  // </div>
  //     </div>
  //   );
  // };
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
        <Header onAddHeader={handleAddHeader} />
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
          <div>
            <PropertyEditor/>
          </div>  
        </div>
      </div>
    </div>
  );
};

export default ProjetPage;
