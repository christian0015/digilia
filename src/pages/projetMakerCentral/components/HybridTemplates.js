import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, useGLTF, Text3D, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { damp } from 'maath/easing';

import jsonData from './json/luxusTemplate.json';

// Extraction du template depuis le JSON
const templateData = jsonData.template;
const templatesData = [templateData];

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

  // Applique les transformations initiales
  useEffect(() => {
    if (!ref.current || !element?.transform) return;
    
    const { position, rotation, scale } = element.transform;
    if (position) ref.current.position.set(...position);
    if (rotation) ref.current.rotation.set(
      THREE.MathUtils.degToRad(rotation[0]),
      THREE.MathUtils.degToRad(rotation[1]),
      THREE.MathUtils.degToRad(rotation[2])
    );
    if (scale) ref.current.scale.set(...scale);
  }, [element?.transform]);

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
          {/* <meshStandardMaterial {...(element.material || {})} /> */}
          <meshStandardMaterial {...(element.material.param || {})} />
        </mesh>
      );
    case 'image3D':
      return (
        <group ref={ref} position={element.position}>
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
        onClick={() => element.events?.onClick && window.dispatchEvent(new CustomEvent(element.events.onClick))}
        // Pour textarea, on utilise value au lieu de children
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
      {element.children?.map((child, i) => (
        <TemplatePreview component={child}/>
      ))}
    </Tag>
  );
};
// Prévisualisation d'un template
const TemplatePreview = ({ component }) => {
  if (!component) return null;

  return (
    <div style={{ 
      // width: '300px', 
      // height: '200px', 
      // position: 'relative',
      // border: '1px solid #ddd',
      // borderRadius: '8px',
      // overflow: 'hidden'
    }}>
      {/* Rendu JSX */}
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
            height: '50svh',
            // height: '400px',
            zIndex: 1,
            background: 'transparent'
          }}
          camera={{ position: [0, 0, 5], fov: 50 }}
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

// Composant principal
const HybridTemplates = ({ onAddContainer, templates = templatesData }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '20px',
      padding: '20px'
    }}>
      {(templates.length > 0 ? templates : []).map((template, i) => (
        <div 
          key={template?.id || i}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            // width: '300px'
          }}
        >
          {/* Affiche tous les composants du template */}
          {template.components?.map((component) => (
            <TemplatePreview key={component.id} component={component} />
          ))}
          
          <span style={{ margin: '8px 0', fontWeight: '500' }}>
            {template?.name || 'Unnamed Template'}
          </span>
          <button
            style={{
              padding: '5px 10px',
              backgroundColor: '#4a6fa5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => 
              {template?.components.forEach((component) => onAddContainer(component))
                // onAddContainer(template)
              }}
          >
            Ajouter
          </button>
        </div>
      ))}
    </div>
  );
};

export default HybridTemplates;