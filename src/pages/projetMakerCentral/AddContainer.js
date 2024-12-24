import React, { useState, useEffect } from "react";
import Container from "./components/Container";

const App = () => {

    // Charger les composants depuis le localStorage
    const storedComponents = JSON.parse(localStorage.getItem('components')) || [];
    const storedSelectedComponent = JSON.parse(localStorage.getItem('selectedComponent'));

    const [components, setComponents] = useState(storedComponents);
    const [selectedComponent, setSelectedComponent] = useState(storedSelectedComponent);

    useEffect(() => {
    // Sauvegarder dans localStorage
    localStorage.setItem('components', JSON.stringify(components));
    console.log("Add Send Component:",components);
    }, [components, selectedComponent]);


  // Ajouter un conteneur
  const handleAddContainer = (template) => {
    // Créer un nouveau conteneur avec ses enfants copiés
    const createNewContainer = (template) => ({
      ...template,
      id: Date.now(), // ID unique pour ce conteneur
      children: template.children.map((child) =>
        child.type === "container" // Si l'enfant est un conteneur, réappliquez la logique récursive
          ? createNewContainer(child) 
          : { ...child, id: `${Date.now()}-${child.id}` } // Copie simple pour les autres éléments
      ),
    });
  
    const newContainer = createNewContainer(template);
  
    if (selectedComponent) {
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
      // Deselectionner
      // setSelectedComponent(null)
      selectComponent(selectedComponent.id)
    } else {
      // Ajouter comme nouvel élément principal
      setComponents((prev) => [...prev, newContainer]);
    }
  };
  

  useEffect(() => {
    console.log("Composants actuels :", components);
  }, [components]);
    

  // Sélectionner un composant pour l'édition
  const selectComponent = (id) => {
    const component = components.find((comp) => comp.id === id);
    setSelectedComponent(component);
  };
  
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
          // Empêche la propagation si on clique sur un parent
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            console.log("Initié comme :",component.id);

          }}
        >
          {component.children.length > 0 ? (
            component.children.map((child) => renderComponent(child)) // Rendu récursif des enfants
          ) : (
            <p style={{ textAlign: "center", color: "#868e96" }}>Empty</p>
          )}
        </div>
      );
    } else {
      // Si c'est un composant enfant
      return (
        <div
          key={component.id}
          style={component.props.style}
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            console.log("Texte initié comme :",component.id);
          }}
        >
          {component.props.text || "Child"}
        </div>
      );
    }
  };
  
        
  return (
    <div style={{ display: "flex", gap: "20px", backgroundColor:"#333", padding: 24, borderRadius: 25 }}>
      <div style={{ flex: 1 }}>
        <h1>Container Editor</h1>
        <Container onAddContainer={handleAddContainer} />
      </div>
    </div>
  );
};

export default App;
