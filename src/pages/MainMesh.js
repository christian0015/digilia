// MainMesh.js
import React, { useState, useEffect, Suspense} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, 
  // MeshTransmissionMaterial,
   Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Rnd } from "react-rnd";
import Container from "./projetMakerCentral/components/Container";
import Mesh from "./projetMakerCentral/components/Mesh";
import Label from './Dashboard';
import './ProjetMaker.css';
import { Link, NavLink  } from 'react-router-dom';import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import isEqual from "lodash.isequal"; // pour comparaison profonde

const userString = localStorage.getItem('digiliaUser');
const userProfil = JSON.parse(userString);

const cssFields = [];

// Composant qui génère la géométrie en fonction du type
const GeometryComponent = ({ type, args }) => {
  switch (type) {
    case 'sphere':
      return <sphereGeometry args={args} />;
    case 'box':
      return <boxGeometry args={args} />;
    case 'torus':
      return <torusGeometry args={args} />;
    case 'cylinder':
      return <cylinderGeometry args={args} />;
    case 'cone':
      return <coneGeometry args={args} />;
    case 'plane':
      return <planeGeometry args={args} />;
    case 'torusKnot':
      return <torusKnotGeometry args={args} />;
    default:
      return <sphereGeometry args={[1, 32, 32]} />;
  }
};

// Composant qui génère le matériau en fonction du type
const MaterialComponent = ({ type, props }) => {
  switch (type) {
    // case 'MeshTransmissionMaterial':
    //   return <MeshTransmissionMaterial 
    //     {...props} 
    //     background={props.bg ? new THREE.Color(props.bg) : undefined} 
    //   />;
    case 'MeshStandardMaterial':
      return <meshStandardMaterial {...props} />;
    case 'MeshPhysicalMaterial':
      return <meshPhysicalMaterial {...props} />;
    case 'MeshBasicMaterial':
      return <meshBasicMaterial {...props} />;
    case 'MeshNormalMaterial':
      return <meshNormalMaterial {...props} />;
    default:
      return <meshStandardMaterial color="#f3f3f3" />;
  }
};

// Composant qui gère les différents types d'objets
const ObjectComponent = ({ template }) => {
  switch (template.type) {
    case 'mesh':
      return (
        <mesh position={template.props.position || [0, 0, 0]} rotation={template.props.rotation || [0, 0, 0]}>
          <GeometryComponent type={template.props.geometry.type} args={template.props.geometry.args} />
          <MaterialComponent type={template.props.material.type} props={template.props.material.props} />
        </mesh>
      );
    case 'light':
      if (template.props.lightType === 'point') {
        return <pointLight {...template.props} />;
      } else if (template.props.lightType === 'spot') {
        return <spotLight {...template.props} />;
      } else if (template.props.lightType === 'directional') {
        return <directionalLight {...template.props} />;
      } else {
        return <ambientLight {...template.props} />;
      }
    case 'group':
      return (
        <group position={template.props.position || [0, 0, 0]} rotation={template.props.rotation || [0, 0, 0]}>
          {template.props.children?.map((child, index) => (
            <ObjectComponent key={index} template={child} />
          ))}
        </group>
      );
    default:
      return null;
  }
};

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
  const storedComponents = JSON.parse(localStorage.getItem('meshComponents'))|| [];
  const [components, setComponents] = useState(storedComponents);
  
  const [history, setHistory] = useState([storedComponents]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedComponent, setSelectedComponent] = useState({});
  useEffect(() => {
      localStorage.setItem("meshComponents", JSON.stringify(components));
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
      // children: template.children.map((child) =>
      children: (template.children || []).map((child) =>
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
    return (
      <div style={{ width: 180, height: 180, border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <ObjectComponent template={component} />
            <Environment preset="studio" />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          </Suspense>
        </Canvas>
      </div>
    );
    
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


  // ***************** Debut Liste Mesh***************** //
  // *****************                    ***************** //
  const AddMesh = () => {  
    return (
      <div>
        <h1>Mesh Editor</h1>
        {/* <Mesh onAddMesh={handleAddMesh} /> */}
        <Mesh onAddContainer={handleAddContainer} />
      </div>
    );
  };
  // ***************** Fin Liste Mesh ***************** //
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

            <NavLink onClick={() => handleComponentChange(<AddMesh />)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>AddMesh</span>
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
          </div>
          
          <button onClick={toggleContainerRigthProjetMaker} className={isShown ? 'container-middle-projet-maker-content-buttonMenu active' : 'container-middle-projet-maker-content-buttonMenu'}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff"><path d="M666-440 440-666l226-226 226 226-226 226Zm-546-80v-320h320v320H120Zm400 400v-320h320v320H520Zm-400 0v-320h320v320H120Zm80-480h160v-160H200v160Zm467 48 113-113-113-113-113 113 113 113Zm-67 352h160v-160H600v160Zm-400 0h160v-160H200v160Zm160-400Zm194-65ZM360-360Zm240 0Z"/></svg>
          </button>
          <div className="container-middle-projet-maker-content">
            <div>
            {/* <Canvas> */}
              {components.map((component) => renderComponent(component))}
            {/* </Canvas> */}
            </div>
          </div>
          
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
