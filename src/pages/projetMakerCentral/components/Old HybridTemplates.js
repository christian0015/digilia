import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF, Text3D, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { damp } from 'maath/easing';

import jsonData from './JsonOrdonneDebut.json';

// La structure correcte du JSON est différente de celle attendue initialement
// On extrait le container depuis le JSON
const containerData = jsonData.container;

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

    const cleanups = element.animations?.map(anim => 
      handleEvent(anim, anim.trigger || 'init')
    ) || [];

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
          const rotSpeed = anim.speed || 1;
          ref.current.rotation[anim.axis] += rotSpeed * delta;
          break;
        case 'hoverScale':
          if (activeAnimations[anim.type]) {
            const targetScale = anim.to || 1.1;
            ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, targetScale, 0.1);
            ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetScale, 0.1);
            ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, targetScale, 0.1);
          } else {
            const baseScale = anim.from || 1;
            ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, baseScale, 0.1);
            ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, baseScale, 0.1);
            ref.current.scale.z = THREE.MathUtils.lerp(ref.current.scale.z, baseScale, 0.1);
          }
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
const Model3D = ({ asset, transform }) => {
  const [error, setError] = useState(false);
  const ref = useRef();
  const { scene } = useGLTF(asset, undefined, (e) => {
    console.error("Error loading model:", e);
    setError(true);
  });
  
  useEffect(() => {
    if (ref.current && transform) {
      if (transform.position) {
        ref.current.position.set(
          transform.position[0] || 0,
          transform.position[1] || 0,
          transform.position[2] || 0
        );
      }
      if (transform.rotation) {
        ref.current.rotation.set(
          transform.rotation[0] || 0,
          transform.rotation[1] || 0,
          transform.rotation[2] || 0
        );
      }
      if (transform.scale) {
        const scale = Array.isArray(transform.scale) 
          ? transform.scale
          : [transform.scale, transform.scale, transform.scale];
        ref.current.scale.set(scale[0] || 1, scale[1] || 1, scale[2] || 1);
      }
    }
  }, [transform]);

  if (error) return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  );
};

// Composant Text3D
const Text3DComponent = ({ content, transform, settings }) => {
  const ref = useRef();
  
  useEffect(() => {
    if (ref.current && transform) {
      if (transform.position) {
        ref.current.position.set(
          transform.position[0] || 0,
          transform.position[1] || 0,
          transform.position[2] || 0
        );
      }
      if (transform.scale) {
        const scale = Array.isArray(transform.scale) 
          ? transform.scale
          : [transform.scale, transform.scale, transform.scale];
        ref.current.scale.set(scale[0] || 1, scale[1] || 1, scale[2] || 1);
      }
    }
  }, [transform]);

  return (
    <group ref={ref}>
      <Text3D
        font={settings?.font || '/fonts/3d/helvetiker_regular.typeface.json'}
        size={settings?.size || 1}
        height={settings?.height || 0.2}
        curveSegments={12}
        bevelEnabled={false}
      >
        {content || "3D Text"}
        <meshStandardMaterial 
          color={settings?.material?.color || "#ffffff"} 
          metalness={settings?.material?.metalness || 0} 
        />
      </Text3D>
    </group>
  );
};

// Composant pour les géométries interactives
const InteractiveMesh = ({ geometry, material, animations }) => {
  const ref = useRef();
  useAnimations({ animations }, ref);

  // Création de la géométrie
  const createGeometry = () => {
    if (!geometry) return new THREE.BoxGeometry(1, 1, 1);
    
    switch (geometry.type) {
      case 'torusKnot':
        return new THREE.TorusKnotGeometry(...(geometry.args || [1, 0.4, 100, 16]));
      case 'sphere':
        return new THREE.SphereGeometry(...(geometry.args || [1, 32, 32]));
      case 'box':
        return new THREE.BoxGeometry(...(geometry.args || [1, 1, 1]));
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  };

  return (
    <mesh ref={ref}>
      {createGeometry()}
      <meshStandardMaterial 
        color={material?.color || "#ffffff"} 
        metalness={material?.metalness || 0} 
      />
    </mesh>
  );
};

// Composant pour le système de particules
const ParticleSystem = ({ transform, settings }) => {
  const ref = useRef();
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const count = settings?.count || 1000;
    const spread = settings?.spread || 10;
    const newParticles = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        position: [
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread
        ],
        size: settings?.size || 0.02
      });
    }
    
    setParticles(newParticles);
  }, [settings?.count, settings?.spread, settings?.size]);

  useEffect(() => {
    if (ref.current && transform?.position) {
      ref.current.position.set(
        transform.position[0] || 0,
        transform.position[1] || 0,
        transform.position[2] || 0
      );
    }
  }, [transform]);

  return (
    <group ref={ref}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size]} />
          <meshBasicMaterial color={settings?.color || "#ffffff"} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
};

// Composant pour les vidéos 3D
const Video3D = ({ src, transform, settings }) => {
  const ref = useRef();
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = src;
      if (settings?.autoplay) videoRef.current.play();
      videoRef.current.loop = settings?.loop || false;
      videoRef.current.muted = settings?.muted || false;
    }
  }, [src, settings]);

  useEffect(() => {
    if (ref.current && transform) {
      if (transform.position) {
        ref.current.position.set(
          transform.position[0] || 0,
          transform.position[1] || 0,
          transform.position[2] || 0
        );
      }
      if (transform.scale) {
        const scale = Array.isArray(transform.scale) 
          ? transform.scale
          : [transform.scale, transform.scale, transform.scale];
        ref.current.scale.set(scale[0] || 1, scale[1] || 1, scale[2] || 1);
      }
    }
  }, [transform]);

  return (
    <group ref={ref}>
      <mesh>
        <planeGeometry args={[16/9, 1]} />
        <meshBasicMaterial>
          <videoTexture attach="map">
            <video 
              ref={videoRef} 
              crossOrigin="anonymous"
              style={{ display: 'none' }}
            />
          </videoTexture>
        </meshBasicMaterial>
      </mesh>
    </group>
  );
};

// Composant Globe
// Composant Globe
const Globe = ({ settings }) => {
  const globeRef = useRef();
  const [markers, setMarkers] = useState([]);
  
  // Call useTexture unconditionally, passing undefined if no texture
  const texture = useTexture(settings?.texture || '/placeholder-texture.jpg');
  
  // If there's no texture specified in settings, don't use the loaded texture
  const finalTexture = settings?.texture ? texture : null;
  
  useEffect(() => {
    if (settings?.markers) {
      setMarkers(settings.markers);
    }
  }, [settings?.markers]);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  // Convertit lat/lng en coordonnées 3D
  const latLngToVector3 = (lat, lng, radius = 1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return [x, y, z];
  };

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color="#1E88E5" 
          map={finalTexture}
        />
      </mesh>
      
      {/* Marqueurs */}
      {markers.map((marker, i) => {
        const position = latLngToVector3(marker.lat, marker.lng, 1.01);
        return (
          <mesh key={i} position={position}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color={marker.color || "#ff0000"} />
          </mesh>
        );
      })}
    </group>
  );
};
// Composant environnement 3D
const Environment3D = ({ preset }) => {
  // Simuler un environnement simple
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {preset === "sunset" && (
        <>
          <color attach="background" args={["#1e1e2f"]} />
          <fog attach="fog" args={["#1e1e1f", 15, 25]} />
        </>
      )}
    </>
  );
};

// Composant 3D Showcase
const Showcase3D = ({ settings, children }) => {
  return (
    <>
      {settings?.orbitControls && <OrbitControls />}
      {children}
    </>
  );
};

// Renderer des éléments 3D
const Element3D = ({ element }) => {
  const ref = useRef();
  useAnimations(element, ref);

  if (!element) return null;

  switch(element.elementType) {
    case 'model':
      return <Model3D asset={element.asset} transform={element.transform} />;
    case 'text3D':
      return <Text3DComponent content={element.content} transform={element.transform} settings={element.settings} />;
    case 'interactiveMesh':
      return <InteractiveMesh geometry={element.geometry} material={element.material} animations={element.animations} />;
    case 'particleSystem':
      return <ParticleSystem transform={element.transform} settings={element.settings} />;
    case 'video3D':
      return <Video3D src={element.src} transform={element.transform} settings={element.settings} />;
    case 'globe':
      return <Globe settings={element.settings} />;
    case 'environment':
      return <Environment3D preset={element.preset} />;
    case 'showcase':
      return <Showcase3D settings={element.settings}>{element.children?.map((child, i) => (
        <Element3D key={child?.id || i} element={child} />
      ))}</Showcase3D>;
    default:
      console.warn('Unknown 3D element type:', element.elementType);
      return null;
  }
};

// Renderer JSX
const ElementJSX = ({ element }) => {
  if (!element) return null;
  
  const Tag = element.elementType || 'div';
  
  // Cas spécial pour les éléments void (input, textarea, etc.)
  if (Tag === 'input' || Tag === 'textarea' || Tag === 'img' || Tag === 'br' || Tag === 'hr') {
    return (
      <Tag 
        style={element.style} 
        {...(element.attributes || {})}
        onClick={() => element.events?.onClick && window.dispatchEvent(new CustomEvent(element.events.onClick))}
        value={Tag === 'textarea' ? element.content : undefined}
      />
    );
  }

  return (
    <Tag 
      style={element.style} 
      {...(element.attributes || {})}
      onClick={() => element.events?.onClick && window.dispatchEvent(new CustomEvent(element.events.onClick))}
    >
      {element.content}
      {element.children?.map((child, i) => {
        // Si c'est un élément 3D, on l'ignore ici (il sera rendu dans la Canvas)
        if (child.type === '3DElement') return null;
        return <ElementJSX key={child?.id || i} element={child} />;
      })}
    </Tag>
  );
};

// Fonction pour filtrer les éléments JSX et 3D
const separateElements = (elements) => {
  const jsxElements = [];
  const threeDElements = [];

  const processElement = (element) => {
    if (!element) return;
    
    if (element.type === '3DElement') {
      threeDElements.push(element);
    } else {
      // Clone l'élément pour le JSX mais filtre ses enfants 3D
      const jsxElement = { ...element };
      if (jsxElement.children) {
        jsxElement.children = jsxElement.children.filter(child => child.type !== '3DElement');
        jsxElement.children.forEach(processElement);
      }
      jsxElements.push(jsxElement);
    }
  };

  elements.forEach(processElement);
  
  return { jsxElements, threeDElements };
};

// Rendu d'une section
const Section = ({ section }) => {
  const { jsxElements, threeDElements } = separateElements([section]);
  
  return (
    <div style={{ position: 'relative' }}>
      {/* Rendu JSX */}
      {jsxElements.map((element, i) => (
        <ElementJSX key={element?.id || i} element={element} />
      ))}

      {/* Rendu 3D si nécessaire */}
      {threeDElements.length > 0 && (
        <Canvas
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          {threeDElements.map((element, i) => (
            <Element3D key={element?.id || i} element={element} />
          ))}
        </Canvas>
      )}

      {/* Pour les éléments 3D à l'intérieur de la section */}
      {section.children?.filter(child => child.type === '3DElement').length > 0 && (
        <Canvas
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          {section.children?.filter(child => child.type === '3DElement').map((element, i) => (
            <Element3D key={element?.id || i} element={element} />
          ))}
        </Canvas>
      )}
    </div>
  );
};

// Composant principal pour rendre le container depuis le JSON
const RenderContainer = ({ container }) => {
  return (
    <div style={container.style}>
      {container.children?.map((section, i) => (
        <Section key={section?.id || i} section={section} />
      ))}
    </div>
  );
};

// Composant principal
const HybridTemplates = () => {
  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <RenderContainer container={containerData} />
    </div>
  );
};

export default HybridTemplates;