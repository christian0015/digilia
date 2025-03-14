import React, { useState, useEffect } from "react";
import Container from "../components/Container";

const PropertyEditor = () => {

  // Charger les composants depuis le localStorage
  const storedComponents = JSON.parse(localStorage.getItem('components'));
  const storedSelectedComponent = JSON.parse(localStorage.getItem('selectedComponent'));

  const [components, setComponents] = useState(storedComponents);
  const [selectedComponent, setSelectedComponent] = useState(storedSelectedComponent || {type: "container"});

useEffect(() => {
  // Sauvegarder dans localStorage
  localStorage.setItem('selectedComponent', JSON.stringify(selectedComponent));
  console.log("Add Send selectedComponent:",selectedComponent);
  localStorage.setItem('components', JSON.stringify(components));
  console.log("Add Send Component:",components);
  }, [components, selectedComponent]);
  
  // Mettre à jour les propriétés d'un composant
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
  
  const removeChildFromContainer = (containerId, childId) => {
    setComponents((prevComponents) => {
      console.log("Avant suppression :", prevComponents);
      const updatedComponents = removeChildRecursively(prevComponents, containerId, childId);
      console.log("Après suppression :", updatedComponents);
      return updatedComponents;
    });
  };
  
  useEffect(() => {
    console.log("Composants actuels :", components);
  }, [components]);
    

  // Supprimer un parent
  const removeParent = (parentId) => {
    console.log("existe:", parentId);
  
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
 
  // Rendu des composants
  useEffect(()=>{
    console.log(components);
  }    
  );
  
// Editeur de propriétés
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
  {selectedComponent.type === "container" && (
    <div>
      <h4>Actions</h4>
      <button
        onClick={() => removeParent(selectedComponent.id)}
        style={{ backgroundColor: "red", color: "white", margin: "5px" }}
      >
        Supprimer ce conteneur
      </button>

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
    </div>
  )}
</div>

        
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
    </div>
  );
};


  return (
    <div style={{ display: "flex", gap: "20px", backgroundColor:"#122"}}>
      <div style={{ flex: 1, borderLeft: "1px solid #ddd", padding: "20px" }}>
        <PropertyEditor />
      </div>
    </div>
  );
};

export default PropertyEditor;
