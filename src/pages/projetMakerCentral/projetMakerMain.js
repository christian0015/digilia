import React, { useState, useEffect } from "react";

const App = () => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);

  useEffect(() => {
    // Charger les composants depuis le localStorage
    const storedComponents = JSON.parse(localStorage.getItem('components'));
    if (storedComponents) {
      setComponents(storedComponents);
    }
  }, [setInterval(() => {}, 1000)]);

  useEffect(() => {
    // Sauvegarder dans localStorage
    localStorage.setItem('selectedComponent', JSON.stringify(selectedComponent));
    // console.log("Main Send selected:",selectComponent);
  }, [selectedComponent]);


  // Sélectionner un composant pour l'édition
  const selectComponent = (id) => {
    const component = components.find((comp) => comp.id === id);
    setSelectedComponent(component);
  };
  
  const renderComponent = (component) => {
    // Si le composant est un conteneur (vide ou parent)
    if (component.type === "container" ) {
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
    }
    if (component.type === "header" ) {
      return (
        <div
          key={component.id}
          style={{
            ...component.props.style,
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #ced4da",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          // Empêche la propagation si on clique sur un parent
          onClick={(e) => {
            setSelectedComponent(component); // Sélectionner ce conteneur
            e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
            console.log("Initié comme :",component.id);

          }}
          
        >
          {component.props.text}
          
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
    <div style={{ display: "flex", gap: "20px"}}>
      <div style={{ flex: 1 }}>
        <div>
          {components.map((component) => renderComponent(component))}
        </div>
      </div>
    </div>
  );
};

export default App;
