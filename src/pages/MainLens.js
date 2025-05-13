// MainMeshLens.js
import React, { useRef, useState, useEffect, Suspense} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, useGLTF, Text3D, useTexture } from '@react-three/drei';
import { OrbitControls, 
  // MeshTransmissionMaterial,
   Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Rnd } from "react-rnd";
import Container from "./projetMakerCentral/components/Container";
import MeshLens from "./projetMakerCentral/components/HybridTemplates";
import templatesData from './projetMakerCentral/components/JsonOrdonneDebut.json';
import Label from './Dashboard';
import './ProjetMaker.css';
import { Link, NavLink  } from 'react-router-dom';import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import isEqual from "lodash.isequal"; // pour comparaison profonde

const userString = localStorage.getItem('digiliaUser');
const userProfil = JSON.parse(userString);


const cssFields = [];


const ProjetPage = () => {
  
// Système d'animation complet
const useAnimations = (element, ref) => {
  const [activeAnimations, setActiveAnimations] = useState({});
  const clock = useRef(0);
  const progress = useRef(0);

  // Gestion des déclencheurs
  useEffect(() => {
    if (!element?.animations) return;

    const handleEvent = (anim, eventType) => {
      switch (eventType) {
        case 'hover':
          const handleOver = () => setActiveAnimations(a => ({ ...a, [anim.type]: true }));
          const handleOut = () => setActiveAnimations(a => ({ ...a, [anim.type]: false }));
          ref.current?.addEventListener('pointerover', handleOver);
          ref.current?.addEventListener('pointerout', handleOut);
          return () => {
            ref.current?.removeEventListener('pointerover', handleOver);
            ref.current?.removeEventListener('pointerout', handleOut);
          };
        case 'click':
          const handleClick = () => setActiveAnimations(a => ({ ...a, [anim.type]: !a[anim.type] }));
          ref.current?.addEventListener('click', handleClick);
          return () => ref.current?.removeEventListener('click', handleClick);
        case 'init':
          setActiveAnimations(a => ({ ...a, [anim.type]: true }));
          return;
        case 'time':
          setActiveAnimations(a => ({ ...a, [anim.type]: true }));
          return;
        case 'scroll':
          const handleScroll = () => {
            const scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            setActiveAnimations(a => ({ ...a, [anim.type]: scrollY > (anim.threshold || 0.5) }));
          };
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
        default:
          return;
      }
    };

    const cleanups = element.animations.map(anim => 
      handleEvent(anim, anim.trigger)
    );

    return () => cleanups.forEach(cleanup => cleanup && cleanup());
  }, [element?.animations]);

  // Application des animations
  useFrame((state, delta) => {
    if (!ref.current || !element?.animations) return;

    element.animations.forEach(anim => {
      if (!activeAnimations[anim.type] && anim.trigger !== 'time') return;

      // Mise à jour de la progression
      if (activeAnimations[anim.type] || anim.trigger === 'time') {
        clock.current += delta;
        progress.current = THREE.MathUtils.clamp(
          clock.current / (anim.duration || 1), 
          0, 
          1
        );

        if (anim.easing) {
          progress.current = THREE.MathUtils[anim.easing](progress.current);
        }
      }

      // Application de l'animation
      switch (anim.type) {
        case 'rotation':
          const rotAngle = anim.from + (anim.to - anim.from) * progress.current;
          ref.current.rotation[anim.axis] = THREE.MathUtils.degToRad(rotAngle);
          break;
        case 'scale':
          const scale = anim.from + (anim.to - anim.from) * progress.current;
          ref.current.scale.set(scale, scale, scale);
          break;
        case 'translation':
          const pos = anim.from + (anim.to - anim.from) * progress.current;
          ref.current.position[anim.axis] = pos;
          break;
        case 'color':
          const color = new THREE.Color(anim.from).lerp(
            new THREE.Color(anim.to), 
            progress.current
          );
          if (ref.current.material) ref.current.material.color.copy(color);
          break;
        case 'gray-color':
          const intensity = (anim.intensity || 1) * progress.current;
          if (ref.current.material) {
            ref.current.material.color.convertSRGBToLinear();
            ref.current.material.color.lerp(new THREE.Color(0x888888), intensity);
          }
          break;
        default:
          break;
      }

      // Gestion des boucles
      if (progress.current >= 1 && anim.loop) {
        clock.current = 0;
        if (anim.loop === 'pingPong') {
          const temp = anim.from;
          anim.from = anim.to;
          anim.to = temp;
        }
      }
    });
  });
};

// Composant Model3D
const Model3D = ({ asset }) => {
  const [error, setError] = useState(false);
  const { scene } = useGLTF(asset, undefined, () => setError(true));

  if (error) return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );

  return <primitive object={scene} />;
};

// Composant Image3D
const Image3D = ({ src, width, height }) => {
  const texture = useTexture(src);
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

const Element3D = ({ element }) => {
  const ref = useRef();
  useAnimations(element, ref);

  // Gestion des géométries de manière sécurisée
  const getGeometry = () => {
    const geometryType = element.geometry?.type || 'BoxGeometry';
    const args = element.geometry?.args || [1, 1, 1];
    
    switch(geometryType) {
      case 'BoxGeometry':
        return new THREE.BoxGeometry(...args);
      case 'SphereGeometry':
        return new THREE.SphereGeometry(...args);
      case 'CylinderGeometry':
        return new THREE.CylinderGeometry(...args);
      case 'PlaneGeometry':
        return new THREE.PlaneGeometry(...args);
      default:
        console.warn(`Geometry type ${geometryType} not supported, using BoxGeometry as fallback`);
        return new THREE.BoxGeometry(1, 1, 1);
    }
  };

  switch(element?.type) {
    case 'group':
      return (
        <group ref={ref}>
          {element.children?.map((child) => (
            <Element3D key={child.id} element={child} />
          ))}
        </group>
      );
    case 'model3D':
      return (
        <group ref={ref} position={element.position}>
          <Suspense fallback={null}>
            <Model3D asset={element.asset} />
          </Suspense>
        </group>
      );
      case 'text3D':
        return (
          <group position={element.position}>
            <Suspense fallback={
              <Html center>
                <div style={{ color: 'white', background: '#333', padding: '5px' }}>
                  Chargement du texte...
                </div>
              </Html>
            }>
              
            </Suspense>
          </group>
        );
    case 'mesh':
      return (
        <mesh
          ref={ref}
          geometry={getGeometry()}
          position={element.position}
        >
          <meshStandardMaterial {...(element.material || {})} />
        </mesh>
      );
    case 'image3D':
      return (
        <group ref={ref} position={element.position}
        >
          <Suspense fallback={null}>
            <Image3D 
              src={element.src} 
              width={element.width || 1} 
              height={element.height || 1}
            />
          </Suspense>
        </group>
      );
      case 'light':
        const lightProps = element.props || {};
        switch(element.lightType) {
          case 'ambient':
            return <ambientLight ref={ref} {...lightProps} />;
          case 'directional':
            return <directionalLight ref={ref} {...lightProps} />;
          case 'point':
            return <pointLight ref={ref} {...lightProps} />;
          case 'spot':
            return <spotLight ref={ref} {...lightProps} />;
          default:
            return <ambientLight ref={ref} {...lightProps} />;
        }
    default:
      return null;
  }
};

// Renderer JSX
// Renderer JSX
const ElementJSX = ({ element }) => {
  if (!element) return null;
  
  const Tag = element.type || 'div';
  
  // Cas spécial pour les éléments void (input, textarea, etc.)
  if (Tag === 'input' || Tag === 'textarea' || Tag === 'img' || Tag === 'br' || Tag === 'hr') {
    return (
      <Tag 
        style={element.style} 
        {...(element.attributes || {})}
        onClick={(e) => {
          element.events?.onClick && window.dispatchEvent(new CustomEvent(element.events.onClick));

          // Autre
          setLocalProps({})
          setSelectedComponent(element); // Sélectionner ce conteneur
          e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
          setMode(null);
          console.log("On click sur id:", element.id);
        }}
          
        // Pour textarea, on utilise value au lieu de children
        value={Tag === 'textarea' ? element.content : undefined}
        
      />
    );
  }

  return (
    <Tag 
      style={element.style} 
      {...(element.attributes || {})}
      onClick={(e) => {
          element.events?.onClick && window.dispatchEvent(new CustomEvent(element.events.onClick));

          // Autre
        setLocalProps({})
        setSelectedComponent(element); // Sélectionner ce conteneur
        e.stopPropagation(); // Empêche le clic d'atteindre les autres éléments parents
        setMode(null);
        console.log("On click sur id:", element.id);
      }}
    >
      {element.content}
      {element.children?.map((child, i) => (
        renderComponent(child)
      ))}
    </Tag>
  );
};


  
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
  const storedComponents = JSON.parse(localStorage.getItem('meshLensComponents'))|| [];
  const [components, setComponents] = useState(storedComponents);
  
  const [history, setHistory] = useState([storedComponents]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedComponent, setSelectedComponent] = useState({});
  useEffect(() => {
      localStorage.setItem("meshLensComponents", JSON.stringify(components));
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
      <div style={{  }}>
       <>
          {component.elementType === "jsxElement" && (
            <ElementJSX element={component} />
          )}
        </>
       
        {/* Rendu 3D */}
        {component.elementType === "3DElement" && (
          <Canvas
            style={{
              // position: 'absolute',
              // top: 0,
              // left: 0,
              width: '100%',
              // width: '600px',
              height: '450px',
              // height: '400px',
              zIndex: 10,
              background: 'transparent'
            }}
            camera={{ position: [0, 0.8,4], fov: 50 }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1.8} />
              <pointLight position={[10, 10, 10]} />
              <Element3D element={component} /> {/* Rendre l'élément */}
              <OrbitControls enableZoom={true} enablePan={true} enableRotate={false} />
            </Suspense>
            </Canvas>
          )}
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


  // ***************** Debut Liste MeshLens***************** //
  // *****************                    ***************** //
  const AddMeshLens = () => {  
    return (
      <div>
        <h1>MeshLens Editor</h1>
        {/* <MeshLens onAddMeshLens={handleAddMeshLens} /> */}
        <MeshLens onAddContainer={handleAddContainer}  />
      </div>
    );
  };
  // ***************** Fin Liste MeshLens ***************** //
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

            <NavLink onClick={() => handleComponentChange(<AddMeshLens />)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>AddMeshLens</span>
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
              {components.map((component) => 
               renderComponent(component))}
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
