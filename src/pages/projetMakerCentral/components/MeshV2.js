import React, { Suspense, useMemo } from "react";
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text,
  Environment,
  PerspectiveCamera,
  useTexture,
  useVideoTexture
} from '@react-three/drei';
import * as THREE from 'three';

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
const MaterialComponent = ({ type, props, bg }) => {
  const materialProps = useMemo(() => {
    if (bg) {
      return { ...props, transparent: true, opacity: props?.opacity || 1 };
    }
    return props;
  }, [props, bg]);

  switch (type) {
    case 'MeshStandardMaterial':
      return <meshStandardMaterial {...materialProps} />;
    case 'MeshPhysicalMaterial':
      return <meshPhysicalMaterial {...materialProps} />;
    case 'MeshBasicMaterial':
      return <meshBasicMaterial {...materialProps} />;
    case 'MeshNormalMaterial':
      return <meshNormalMaterial {...materialProps} />;
    default:
      return <meshStandardMaterial color="#f3f3f3" />;
  }
};

// Composant pour le texte
const MeshText = ({ content, position, rotation, color, fontSize, bg }) => {
  return (
    <group position={position} rotation={rotation}>
      {bg && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[fontSize * content.length * 0.5, fontSize * 1.2]} />
          <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
        </mesh>
      )}
      <Text color={color || 'white'} fontSize={fontSize || 1}>
        {content}
      </Text>
    </group>
  );
};

// Composant pour les images
const MeshImage = ({ url, position, rotation, scale, bg }) => {
  const texture = useTexture(url);
  return (
    <group position={position} rotation={rotation} scale={scale || [1, 1, 1]}>
      {bg && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[texture.image.width / 100, texture.image.height / 100]} />
          <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh>
        <planeGeometry args={[texture.image.width / 100, texture.image.height / 100]} />
        <meshBasicMaterial map={texture} transparent={!!bg} />
      </mesh>
    </group>
  );
};

// Composant pour les vidéos
const MeshVideo = ({ url, position, rotation, scale, bg }) => {
  const texture = useVideoTexture(url);
  return (
    <group position={position} rotation={rotation} scale={scale || [1, 1, 1]}>
      {bg && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[4, 2]} />
          <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh>
        <planeGeometry args={[4, 2]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent={!!bg} />
      </mesh>
    </group>
  );
};

// Composant pour les modèles 3D (simplifié - à adapter selon votre système de chargement)
const MeshModel = ({ url, position, rotation, scale, bg }) => {
  // Dans une implémentation réelle, vous utiliseriez useGLTF ou similaire
  return (
    <group position={position} rotation={rotation} scale={scale || [1, 1, 1]}>
      {bg && (
        <mesh position={[0, 0, -2]}>
          <boxGeometry args={[3, 3, 0.1]} />
          <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Ici vous chargeriez votre modèle */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
};

// Composant qui gère les différents types d'objets
const ObjectComponent = ({ template }) => {
  switch (template.type) {
    case 'mesh':
      return (
        <mesh position={template.props.position || [0, 0, 0]} rotation={template.props.rotation || [0, 0, 0]}>
          <GeometryComponent type={template.props.geometry.type} args={template.props.geometry.args} />
          <MaterialComponent 
            type={template.props.material.type} 
            props={template.props.material.props} 
            bg={template.props.material.bg}
          />
        </mesh>
      );
    case 'meshText':
      return (
        <MeshText
          content={template.props.content}
          position={template.props.position || [0, 0, 0]}
          rotation={template.props.rotation || [0, 0, 0]}
          color={template.props.color}
          fontSize={template.props.fontSize}
          bg={template.props.bg}
        />
      );
    case 'meshImage':
      return (
        <MeshImage
          url={template.props.url}
          position={template.props.position || [0, 0, 0]}
          rotation={template.props.rotation || [0, 0, 0]}
          scale={template.props.scale}
          bg={template.props.bg}
        />
      );
    case 'meshVideo':
      return (
        <MeshVideo
          url={template.props.url}
          position={template.props.position || [0, 0, 0]}
          rotation={template.props.rotation || [0, 0, 0]}
          scale={template.props.scale}
          bg={template.props.bg}
        />
      );
    case 'meshModel':
      return (
        <MeshModel
          url={template.props.url}
          position={template.props.position || [0, 0, 0]}
          rotation={template.props.rotation || [0, 0, 0]}
          scale={template.props.scale}
          bg={template.props.bg}
        />
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

const SceneObjects = ({ onAddContainer }) => {
  // Bibliothèque d'objets étendue
  const objectTemplates = [
    {
      "id": "mesh-glass-sphere",
      "name": "Sphère en verre",
      "type": "mesh",
      "props": {
        "geometry": {
          "type": "sphere",
          "args": [1.4, 64, 64]
        },
        "material": {
          "type": "MeshPhysicalMaterial",
          "props": {
            "transmission": 1,
            "roughness": 0.0,
            "thickness": 3.5,
            "ior": 1.5,
            "chromaticAberration": 0.06,
            "anisotropy": 0.1,
            "distortion": 0.0,
            "distortionScale": 0.3,
            "temporalDistortion": 0.5,
            "clearcoat": 1,
            "attenuationDistance": 0.5,
            "attenuationColor": "#ffffff",
            "color": "#c9ffa1"
          },
          "bg": "#839681"
        }
      }
    },
    {
      "id": "mesh-metal-cube",
      "name": "Cube métallique",
      "type": "mesh",
      "props": {
        "geometry": {
          "type": "box",
          "args": [1.5, 1.5, 1.5]
        },
        "material": {
          "type": "MeshStandardMaterial",
          "props": {
            "color": "#4080FF",
            "metalness": 0.9,
            "roughness": 0.2
          }
        }
      }
    },
    {
      "id": "text-basic",
      "name": "Texte 3D",
      "type": "meshText",
      "props": {
        "content": "Hello World",
        "color": "#ffffff",
        "fontSize": 1,
        "bg": "#333333"
      }
    },
    {
      "id": "image-basic",
      "name": "Image",
      "type": "meshImage",
      "props": {
        "url": "https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX35634371.jpg",
        "bg": "#eeeeee"
      }
    },
    {
      "id": "video-basic",
      "name": "Vidéo",
      "type": "meshVideo",
      "props": {
        "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "bg": "#000000"
      }
    },
    {
      "id": "model-basic",
      "name": "Modèle 3D",
      "type": "meshModel",
      "props": {
        "url": "3D/objs/911-transformed.glb",
        "bg": "#222222"
      }
    },
    {
      "id": "light-point-blue",
      "name": "Lumière ponctuelle",
      "type": "light",
      "props": {
        "lightType": "point",
        "color": "#4060FF",
        "intensity": 1.5,
        "distance": 10,
        "position": [2, 2, 2]
      }
    },
    {
      "id": "group-basic",
      "name": "Groupe d'objets",
      "type": "group",
      "props": {
        "position": [0, 0, 0],
        "children": [
          {
            "type": "mesh",
            "props": {
              "position": [-1, 0, 0],
              "geometry": {
                "type": "sphere",
                "args": [0.6, 32, 32]
              },
              "material": {
                "type": "MeshStandardMaterial",
                "props": {
                  "color": "#60FF60",
                  "roughness": 0.4
                }
              }
            }
          },
          {
            "type": "meshText",
            "props": {
              "position": [1, 0, 0],
              "content": "Group",
              "color": "#ffffff",
              "bg": "#333333"
            }
          }
        ]
      }
    }
  ];

  const renderPreview = (template) => {
    return (
      <div style={{ width: 180, height: 180, border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <ObjectComponent template={template} />
            <Environment preset="studio" />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div>
      <h3>Bibliothèque d'objets</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {objectTemplates.map((template) => (
          <div key={template.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {renderPreview(template)}
            <span style={{ margin: "8px 0", fontWeight: "500" }}>{template.name}</span>
            <button
              style={{
                padding: "5px 10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
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

export default SceneObjects;