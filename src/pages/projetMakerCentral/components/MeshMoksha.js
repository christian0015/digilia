import React, { Suspense, useMemo, useRef } from "react";
import { Canvas , useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text,
  Environment,
  PerspectiveCamera,
  useTexture,
  Float,
  Sparkles
} from '@react-three/drei';
import * as THREE from 'three';

// Types de composants Moksha 3D
const MOKSHA_COMPONENTS = {
  MEDITATION_SPHERE: 'meditationSphere',
  MANDALA: 'mandala',
  LOTUS: 'lotus',
  CHAKRA: 'chakra',
  OM_SYMBOL: 'omSymbol',
  SPIRAL: 'spiral',
  PILLAR: 'pillar',
  WATER: 'water'
};

// Composant de base pour les objets Moksha
const MokshaObject = ({ type, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], color, glow, children }) => {
  const groupRef = useRef();

  // Animation de flottement doux
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y = rotation[1] + clock.elapsedTime * 0.1;
    }
  });

  const getGeometry = () => {
    switch(type) {
      case MOKSHA_COMPONENTS.MEDITATION_SPHERE:
        return <sphereGeometry args={[1, 32, 32]} />;
      case MOKSHA_COMPONENTS.MANDALA:
        return <torusGeometry args={[1, 0.05, 16, 100]} />;
      case MOKSHA_COMPONENTS.LOTUS:
        return <coneGeometry args={[1, 0.3, 8]} />;
      case MOKSHA_COMPONENTS.CHAKRA:
        return <torusKnotGeometry args={[0.8, 0.2, 100, 16]} />;
      case MOKSHA_COMPONENTS.OM_SYMBOL:
        return <planeGeometry args={[2, 1]} />;
      case MOKSHA_COMPONENTS.SPIRAL:
        return <cylinderGeometry args={[0.1, 1, 2, 8, 1, true]} />;
      case MOKSHA_COMPONENTS.PILLAR:
        return <cylinderGeometry args={[0.3, 0.3, 3, 8]} />;
      case MOKSHA_COMPONENTS.WATER:
        return <planeGeometry args={[5, 5, 32, 32]} />;
      default:
        return <sphereGeometry args={[1, 32, 32]} />;
    }
  };

  const getMaterial = () => {
    const baseProps = {
      color: color || '#a0c0ff',
      transparent: true,
      opacity: 0.9,
      metalness: 0.1,
      roughness: 0.5
    };

    if (glow) {
      return <meshStandardMaterial {...baseProps} emissive={color || '#a0c0ff'} emissiveIntensity={0.5} />;
    }
    return <meshStandardMaterial {...baseProps} />;
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh>
        {getGeometry()}
        {getMaterial()}
      </mesh>
      {children}
    </group>
  );
};

// Composant texte spirituel
const MokshaText = ({ content, position = [0, 0, 0], color = '#ffffff', fontSize = 0.5, bgColor }) => {
  return (
    <group position={position}>
      {bgColor && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[content.length * fontSize * 0.6, fontSize * 1.5]} />
          <meshBasicMaterial color={bgColor} side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
      )}
      <Text
        color={color}
        fontSize={fontSize}
        font="/fonts/NotoSansDevanagari-Regular.woff"
        anchorX="center"
        anchorY="middle"
      >
        {content}
      </Text>
    </group>
  );
};

// Composant pour les symboles sacrés
const SacredSymbol = ({ type, position = [0, 0, 0], size = 1 }) => {
  const texture = useTexture({
    [MOKSHA_COMPONENTS.OM_SYMBOL]: 'https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX35634371.jpg',
    // Ajoutez d'autres textures pour d'autres symboles
  }[type]);

  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

// Composant particules d'énergie
const EnergyParticles = ({ count = 100, color = '#88ccff', size = 0.1 }) => {
  return (
    <Sparkles
      count={count}
      size={size}
      scale={5}
      speed={0.2}
      color={color}
      opacity={0.8}
    />
  );
};

// Composant principal de rendu Moksha
const MeshMoksha = ({ template, onAddTemplate }) => {
  const renderObject = (obj) => {
    switch(obj.type) {
      case MOKSHA_COMPONENTS.MEDITATION_SPHERE:
      case MOKSHA_COMPONENTS.MANDALA:
      case MOKSHA_COMPONENTS.LOTUS:
      case MOKSHA_COMPONENTS.CHAKRA:
      case MOKSHA_COMPONENTS.OM_SYMBOL:
      case MOKSHA_COMPONENTS.SPIRAL:
      case MOKSHA_COMPONENTS.PILLAR:
      case MOKSHA_COMPONENTS.WATER:
        return (
          <MokshaObject
            type={obj.type}
            position={obj.position}
            rotation={obj.rotation}
            scale={obj.scale}
            color={obj.color}
            glow={obj.glow}
          />
        );
      case 'text':
        return (
          <MokshaText
            content={obj.content}
            position={obj.position}
            color={obj.color}
            fontSize={obj.fontSize}
            bgColor={obj.bgColor}
          />
        );
      case 'symbol':
        return (
          <SacredSymbol
            type={obj.symbolType}
            position={obj.position}
            size={obj.size}
          />
        );
      case 'particles':
        return (
          <EnergyParticles
            count={obj.count}
            color={obj.color}
            size={obj.size}
          />
        );
      case 'group':
        return (
          <group position={obj.position} rotation={obj.rotation} scale={obj.scale}>
            {obj.children?.map((child, idx) => (
              <React.Fragment key={idx}>
                {renderObject(child)}
              </React.Fragment>
            ))}
          </group>
        );
      default:
        return null;
    }
  };

  // Bibliothèque de templates Moksha 3D
  const mokshaTemplates = [
    {
      id: 'meditation-sphere',
      name: 'Sphère de méditation',
      template: {
        type: MOKSHA_COMPONENTS.MEDITATION_SPHERE,
        position: [0, 0, 0],
        color: '#a0c0ff',
        glow: true
      }
    },
    {
      id: 'mandala-floating',
      name: 'Mandala flottant',
      template: {
        type: MOKSHA_COMPONENTS.MANDALA,
        position: [0, 0, 0],
        color: '#ffa0c0',
        rotation: [0, 0, Math.PI/4]
      }
    },
    {
      id: 'lotus-flower',
      name: 'Fleur de lotus',
      template: {
        type: MOKSHA_COMPONENTS.LOTUS,
        position: [0, 0, 0],
        color: '#ffffff',
        children: (
          <EnergyParticles count={50} color="#ffa0ff" size={0.2} />
        )
      }
    },
    {
      id: 'chakra-energy',
      name: 'Énergie des chakras',
      template: {
        type: MOKSHA_COMPONENTS.CHAKRA,
        position: [0, 0, 0],
        color: '#60ff60',
        glow: true
      }
    },
    {
      id: 'om-symbol',
      name: 'Symbole OM',
      template: {
        type: 'symbol',
        symbolType: MOKSHA_COMPONENTS.OM_SYMBOL,
        position: [0, 0, 0],
        size: 2
      }
    },
    {
      id: 'spiritual-text',
      name: 'Texte spirituel',
      template: {
        type: 'text',
        content: "ॐ",
        position: [0, 0, 0],
        color: '#ffffff',
        fontSize: 1,
        bgColor: '#000000'
      }
    },
    {
      id: 'energy-field',
      name: 'Champ énergétique',
      template: {
        type: 'particles',
        count: 200,
        color: '#88ccff',
        size: 0.1
      }
    },
    {
      id: 'meditation-space',
      name: 'Espace de méditation',
      template: {
        type: 'group',
        position: [0, 0, 0],
        children: [
          {
            type: MOKSHA_COMPONENTS.WATER,
            position: [0, -0.5, 0],
            color: '#4060a0'
          },
          {
            type: MOKSHA_COMPONENTS.PILLAR,
            position: [0, 0, 0],
            color: '#d0b080'
          },
          {
            type: 'text',
            content: "Paix Intérieure",
            position: [0, 2, 0],
            color: '#ffffff',
            fontSize: 0.3
          }
        ]
      }
    }
  ];

  const renderPreview = (template) => {
    return (
      <div style={{ width: 180, height: 180, border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1} />
            {renderObject(template.template)}
            <Environment preset="sunset" />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
          </Suspense>
        </Canvas>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>Bibliothèque Moksha 3D</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {mokshaTemplates.map((template) => (
          <div key={template.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {renderPreview(template)}
            <span style={{ margin: "8px 0", fontWeight: "500" }}>{template.name}</span>
            <button
              style={{
                padding: "5px 10px",
                backgroundColor: "#4a6fa5",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => onAddTemplate(template.template)}
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeshMoksha;