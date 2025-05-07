import React, { Suspense, useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text,
  Environment,
  PerspectiveCamera,
  useTexture,
  useVideoTexture,
  MeshDistortMaterial,
  useGLTF,
  Float,
  Trail,
  Sparkles,
  Billboard,
  Reflector
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
    case 'octahedron':
      return <octahedronGeometry args={args} />;
    case 'dodecahedron':
      return <dodecahedronGeometry args={args} />;
    case 'icosahedron':
      return <icosahedronGeometry args={args} />;
    case 'tetrahedron':
      return <tetrahedronGeometry args={args} />;
    case 'capsule':
      return <capsuleGeometry args={args} />;
    default:
      return <sphereGeometry args={[1, 32, 32]} />;
  }
};

// Effet d'oscillation pour les objets flottants
const useFloatAnimation = (ref, options = {}) => {
  const { 
    amplitude = 0.1, 
    frequency = 1, 
    rotation = true,
    rotationSpeed = 0.2
  } = options;
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    
    // N'appliquer l'animation que si l'amplitude est > 0
    if (amplitude > 0) {
      // Animation verticale
      ref.current.position.y += Math.sin(clock.elapsedTime * frequency) * amplitude * 0.01;
    }
    
    // Animation de rotation seulement si rotation est true
    if (rotation && rotationSpeed > 0) {
      ref.current.rotation.y += rotationSpeed * 0.01;
    }
  });
};

// Matériau avec effet de pulsation
const PulsingMaterial = ({ color, speed = 1, intensity = 0.2, ...props }) => {
  const meshRef = useRef();
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    const emissiveIntensity = Math.sin(clock.elapsedTime * speed) * intensity + intensity;
    meshRef.current.emissiveIntensity = emissiveIntensity;
  });
  
  return (
    <meshStandardMaterial 
      ref={meshRef}
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      {...props}
    />
  );
};

// Composant qui génère le matériau en fonction du type avec effets améliorés
const MaterialComponent = ({ type, props, bg, animationType }) => {
  const materialProps = useMemo(() => {
    if (bg) {
      return { ...props, transparent: true, opacity: props?.opacity || 1 };
    }
    return props;
  }, [props, bg]);

  // Pour les matériaux avec animation spéciale
  if (animationType === 'pulsing') {
    return <PulsingMaterial {...materialProps} />;
  }

  switch (type) {
    case 'MeshStandardMaterial':
      return <meshStandardMaterial {...materialProps} />;
    case 'MeshPhysicalMaterial':
      return <meshPhysicalMaterial {...materialProps} />;
    case 'MeshBasicMaterial':
      return <meshBasicMaterial {...materialProps} />;
    case 'MeshNormalMaterial':
      return <meshNormalMaterial {...materialProps} />;
    case 'MeshDistortMaterial':
      return <MeshDistortMaterial {...materialProps} />;
    case 'MeshToonMaterial':
      return <meshToonMaterial {...materialProps} />;
    case 'MeshPhongMaterial':
      return <meshPhongMaterial {...materialProps} />;
    case 'MeshLambertMaterial':
      return <meshLambertMaterial {...materialProps} />;
    default:
      return <meshStandardMaterial color="#f3f3f3" />;
  }
};

// Composant pour le texte amélioré avec options d'affichage futuriste
const MeshText = ({ content, position, rotation = [0, 0, 0], color, fontSize, bg, style = 'normal', glowColor, glowIntensity = 0.5 }) => {
  // Limiter la rotation pour garder lisibilité
  const safeRotation = useMemo(() => {
    const maxAngle = Math.PI / 12; // ~15 degrés max
    return [
      Math.max(-maxAngle, Math.min(maxAngle, rotation[0])),
      Math.max(-maxAngle, Math.min(maxAngle, rotation[1])),
      Math.max(-maxAngle, Math.min(maxAngle, rotation[2]))
    ];
  }, [rotation]);
  
  const textRef = useRef();
  const glowRef = useRef();
  
  // Animation de pulsation pour le glow
  useFrame(({ clock }) => {
    if (glowRef.current && glowColor) {
      glowRef.current.material.opacity = (Math.sin(clock.elapsedTime * 2) * 0.2 + 0.8) * glowIntensity;
    }
  });

  if (style === 'floating') {
    return (
      <Float 
        speed={2} 
        rotationIntensity={0.2} 
        floatIntensity={0.5}
        position={position}
      >
        <group rotation={safeRotation}>
          {bg && (
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[fontSize * content.length * 0.5, fontSize * 1.2]} />
              <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
            </mesh>
          )}
          {glowColor && (
            <mesh ref={glowRef} position={[0, 0, -0.005]}>
              <planeGeometry args={[fontSize * content.length * 0.6, fontSize * 1.4]} />
              <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
          )}
          <Text 
            color={color || 'white'} 
            fontSize={fontSize || 1}
            font="/fonts/Inter-Bold.woff"
            anchorX="center"
            anchorY="middle"
          >
            {content}
          </Text>
        </group>
      </Float>
    );
  }
  
  // Style normal ou style billboard (toujours face à la caméra)
  return (
    <group position={position}>
      {style === 'billboard' ? (
        <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
          {bg && (
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[fontSize * content.length * 0.5, fontSize * 1.2]} />
              <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
            </mesh>
          )}
          {glowColor && (
            <mesh ref={glowRef} position={[0, 0, -0.005]}>
              <planeGeometry args={[fontSize * content.length * 0.6, fontSize * 1.4]} />
              <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
          )}
          <Text 
            color={color || 'white'} 
            fontSize={fontSize || 1}
            font="/fonts/Inter-Bold.woff"
            anchorX="center"
            anchorY="middle"
          >
            {content}
          </Text>
        </Billboard>
      ) : (
        <group rotation={safeRotation}>
          {bg && (
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[fontSize * content.length * 0.5, fontSize * 1.2]} />
              <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
            </mesh>
          )}
          {glowColor && (
            <mesh ref={glowRef} position={[0, 0, -0.005]}>
              <planeGeometry args={[fontSize * content.length * 0.6, fontSize * 1.4]} />
              <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
          )}
          <Text 
            ref={textRef}
            color={color || 'white'} 
            fontSize={fontSize || 1}
            font="/fonts/Inter-Bold.woff"
            anchorX="center"
            anchorY="middle"
          >
            {content}
          </Text>
        </group>
      )}
    </group>
  );
};

// Composant pour les images amélioré
const MeshImage = ({ url, position, rotation = [0, 0, 0], scale, bg, style = 'normal', glowColor, glowIntensity = 0.5, interactive = false }) => {
  const texture = useTexture(url);
  const meshRef = useRef();
  const glowRef = useRef();
  
  // Limiter la rotation pour garder lisibilité
  const safeRotation = useMemo(() => {
    const maxAngle = Math.PI / 12; // ~15 degrés max
    return [
      Math.max(-maxAngle, Math.min(maxAngle, rotation[0])),
      Math.max(-maxAngle, Math.min(maxAngle, rotation[1])),
      Math.max(-maxAngle, Math.min(maxAngle, rotation[2]))
    ];
  }, [rotation]);
  
  // Animation pour le glow
  useFrame(({ clock }) => {
    if (glowRef.current && glowColor) {
      glowRef.current.material.opacity = (Math.sin(clock.elapsedTime * 2) * 0.2 + 0.8) * glowIntensity;
    }
  });
  
  // Style flottant
  if (style === 'floating') {
    return (
      <Float 
        speed={1.5} 
        rotationIntensity={0.2} 
        floatIntensity={0.5}
        position={position}
      >
        <group rotation={safeRotation} scale={scale || [1, 1, 1]}>
          {bg && (
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[texture.image.width / 100, texture.image.height / 100]} />
              <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
            </mesh>
          )}
          {glowColor && (
            <mesh ref={glowRef} position={[0, 0, -0.005]}>
              <planeGeometry args={[texture.image.width / 100 * 1.05, texture.image.height / 100 * 1.05]} />
              <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
          )}
          <mesh ref={meshRef}>
            <planeGeometry args={[texture.image.width / 100, texture.image.height / 100]} />
            <meshBasicMaterial map={texture} transparent={!!bg} />
          </mesh>
        </group>
      </Float>
    );
  }
  
  // Style reflété
  if (style === 'reflected') {
    return (
      <group position={position} rotation={safeRotation} scale={scale || [1, 1, 1]}>
        {bg && (
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[texture.image.width / 100, texture.image.height / 100]} />
            <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
          </mesh>
        )}
        {glowColor && (
          <mesh ref={glowRef} position={[0, 0, -0.005]}>
            <planeGeometry args={[texture.image.width / 100 * 1.05, texture.image.height / 100 * 1.05]} />
            <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        )}
        <mesh ref={meshRef}>
          <planeGeometry args={[texture.image.width / 100, texture.image.height / 100]} />
          <meshBasicMaterial map={texture} transparent={!!bg} />
        </mesh>
        
        {/* Réflexion */}
        <Reflector
          resolution={1024}
          args={[texture.image.width / 100, texture.image.height / 100]}
          mirror={0.5}
          mixBlur={8}
          mixStrength={1}
          blur={[0, 0]}
          position={[0, -texture.image.height / 200 - 0.025, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {(Material, props) => (
            <Material
              color="#a0a0a0"
              metalness={0.5}
              roughnessMap={null}
              roughness={1}
              {...props}
            />
          )}
        </Reflector>
      </group>
    );
  }
  
  // Style billboard (toujours face à la caméra)
  if (style === 'billboard') {
    return (
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        position={position}
      >
        <group scale={scale || [1, 1, 1]}>
          {bg && (
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[texture.image.width / 100, texture.image.height / 100]} />
              <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
            </mesh>
          )}
          {glowColor && (
            <mesh ref={glowRef} position={[0, 0, -0.005]}>
              <planeGeometry args={[texture.image.width / 100 * 1.05, texture.image.height / 100 * 1.05]} />
              <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
          )}
          <mesh>
            <planeGeometry args={[texture.image.width / 100, texture.image.height / 100]} />
            <meshBasicMaterial map={texture} transparent={!!bg} />
          </mesh>
        </group>
      </Billboard>
    );
  }
  
  // Style normal
  return (
    <group position={position} rotation={safeRotation} scale={scale || [1, 1, 1]}>
      {bg && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[texture.image.width / 100, texture.image.height / 100]} />
          <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
        </mesh>
      )}
      {glowColor && (
        <mesh ref={glowRef} position={[0, 0, -0.005]}>
          <planeGeometry args={[texture.image.width / 100 * 1.05, texture.image.height / 100 * 1.05]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh ref={meshRef}>
        <planeGeometry args={[texture.image.width / 100, texture.image.height / 100]} />
        <meshBasicMaterial map={texture} transparent={!!bg} />
      </mesh>
    </group>
  );
};

// Composant pour les vidéos amélioré
const MeshVideo = ({ url, position, rotation = [0, 0, 0], scale, bg, style = 'normal', glowColor, glowIntensity = 0.5 }) => {
  const texture = useVideoTexture(url);
  const meshRef = useRef();
  const glowRef = useRef();
  
  // Limiter la rotation pour garder lisibilité
  const safeRotation = useMemo(() => {
    const maxAngle = Math.PI / 12; // ~15 degrés max
    return [
      Math.max(-maxAngle, Math.min(maxAngle, rotation[0])),
      Math.max(-maxAngle, Math.min(maxAngle, rotation[1])),
      Math.max(-maxAngle, Math.min(maxAngle, rotation[2]))
    ];
  }, [rotation]);
  
  // Animation pour le glow
  useFrame(({ clock }) => {
    if (glowRef.current && glowColor) {
      glowRef.current.material.opacity = (Math.sin(clock.elapsedTime * 2) * 0.2 + 0.8) * glowIntensity;
    }
  });
  
  // Style flottant
  if (style === 'floating') {
    return (
      <Float 
        speed={1.5} 
        rotationIntensity={0.1} 
        floatIntensity={0.3}
        position={position}
      >
        <group rotation={safeRotation} scale={scale || [1, 1, 1]}>
          {bg && (
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[4, 2]} />
              <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
            </mesh>
          )}
          {glowColor && (
            <mesh ref={glowRef} position={[0, 0, -0.005]}>
              <planeGeometry args={[4.1, 2.1]} />
              <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
          )}
          <mesh ref={meshRef}>
            <planeGeometry args={[4, 2]} />
            <meshBasicMaterial map={texture} toneMapped={false} transparent={!!bg} />
          </mesh>
        </group>
      </Float>
    );
  }
  
  // Style reflété
  if (style === 'reflected') {
    return (
      <group position={position} rotation={safeRotation} scale={scale || [1, 1, 1]}>
        {bg && (
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[4, 2]} />
            <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
          </mesh>
        )}
        {glowColor && (
          <mesh ref={glowRef} position={[0, 0, -0.005]}>
            <planeGeometry args={[4.1, 2.1]} />
            <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        )}
        <mesh ref={meshRef}>
          <planeGeometry args={[4, 2]} />
          <meshBasicMaterial map={texture} toneMapped={false} transparent={!!bg} />
        </mesh>
        
        {/* Réflexion */}
        <Reflector
          resolution={1024}
          args={[4, 2]}
          mirror={0.5}
          mixBlur={8}
          mixStrength={1}
          blur={[0, 0]}
          position={[0, -1.025, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {(Material, props) => (
            <Material
              color="#a0a0a0"
              metalness={0.5}
              roughnessMap={null}
              roughness={1}
              {...props}
            />
          )}
        </Reflector>
      </group>
    );
  }
  
  // Style billboard
  if (style === 'billboard') {
    return (
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        position={position}
      >
        <group scale={scale || [1, 1, 1]}>
          {bg && (
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[4, 2]} />
              <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
            </mesh>
          )}
          {glowColor && (
            <mesh ref={glowRef} position={[0, 0, -0.005]}>
              <planeGeometry args={[4.1, 2.1]} />
              <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
          )}
          <mesh>
            <planeGeometry args={[4, 2]} />
            <meshBasicMaterial map={texture} toneMapped={false} transparent={!!bg} />
          </mesh>
        </group>
      </Billboard>
    );
  }
  
  return (
    <group position={position} rotation={safeRotation} scale={scale || [1, 1, 1]}>
      {bg && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[4, 2]} />
          <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
        </mesh>
      )}
      {glowColor && (
        <mesh ref={glowRef} position={[0, 0, -0.005]}>
          <planeGeometry args={[4.1, 2.1]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh ref={meshRef}>
        <planeGeometry args={[4, 2]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent={!!bg} />
      </mesh>
    </group>
  );
};

// Composant pour les modèles 3D amélioré
const MeshModel = ({ url, position, rotation, scale, bg, animationType }) => {
  const meshRef = useRef();
  
  // Appel du hook de manière inconditionnelle
  useFloatAnimation(meshRef, {
    amplitude: animationType === 'floating' ? 0.5 : 0,
    frequency: animationType === 'floating' ? 0.8 : 0,
    rotation: animationType === 'floating',
    rotationSpeed: animationType === 'floating' ? 0.3 : 0
  });
  
  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale || [1, 1, 1]}>
      {bg && (
        <mesh position={[0, 0, -2]}>
          <boxGeometry args={[3, 3, 0.1]} />
          <meshBasicMaterial color={bg} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Ici vous chargeriez votre modèle, pour la démo on utilise une géométrie simple */}
      {animationType === 'glowing' ? (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <PulsingMaterial 
            color="orange" 
            speed={1.2} 
            intensity={0.8}
            roughness={0.2} 
            metalness={0.8}
          />
        </mesh>
      ) : (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" roughness={0.2} metalness={0.8} />
        </mesh>
      )}
    </group>
  );
};

// Particules pour effets
const ParticleField = ({ count = 200, color = '#88ccff', size = 0.02, area = [10, 10, 10] }) => {
  return (
    <Sparkles
      count={count}
      size={size}
      scale={area}
      speed={0.3}
      color={color}
      opacity={0.6}
    />
  );
};

// Effet de trail (traînée)
const TrailEffect = ({ children, width = 0.5, color = "#00ffff", length = 8 }) => {
  return (
    <Trail
      width={width}
      color={color}
      length={length}
      decay={0.7}
      local={false}
      stride={0}
      interval={1}
      attenuation={(width) => width}
    >
      {children}
    </Trail>
  );
};

// Composant pour les hologrammes
const HologramMesh = ({ geometryType, args, position, rotation, scale }) => {
  const meshRef = useRef();
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.material.opacity = Math.sin(clock.elapsedTime * 3) * 0.2 + 0.5;
  });
  
  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale || [1, 1, 1]}>
      <GeometryComponent type={geometryType} args={args} />
      <meshBasicMaterial 
        color="#00aaff" 
        wireframe 
        transparent 
        opacity={0.6}
      />
    </mesh>
  );
};

// Composant qui gère les différents types d'objets avec les nouveaux effets
const ObjectComponent = ({ template }) => {
  // Références pour les animations personnalisées
  const meshRef = useRef();
  
  // Appliquer des animations si nécessaire
  useEffect(() => {
    if (template?.props?.animation === 'rotate' && meshRef.current) {
      const animate = () => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y += 0.01;
        requestAnimationFrame(animate);
      };
      const animationId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationId);
    }
  }, [template]);
  
  // Gérer les types d'objets spéciaux futuristes
  if (template.type === 'hologram') {
    return (
      <HologramMesh 
        geometryType={template.props.geometryType || 'sphere'}
        args={template.props.args}
        position={template.props.position || [0, 0, 0]}
        rotation={template.props.rotation || [0, 0, 0]}
        scale={template.props.scale}
      />
    );
  }

  if (template.type === 'particles') {
    return (
      <ParticleField 
        count={template.props.count || 200}
        color={template.props.color || '#88ccff'}
        size={template.props.size || 0.02}
        area={template.props.area || [10, 10, 10]}
      />
    );
  }
  
  if (template.type === 'portal') {
    return (
      <group position={template.props.position || [0, 0, 0]} rotation={template.props.rotation || [0, 0, 0]}>
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.4}>
          <mesh>
            <torusGeometry args={[2, 0.2, 32, 100]} />
            <MeshDistortMaterial
              color={template.props.color || "#8060ff"}
              speed={template.props.speed || 2}
              distort={template.props.distort || 0.4}
              radius={1}
              emissive={template.props.emissive || "#8060ff"}
              emissiveIntensity={2}
            />
          </mesh>
          <mesh>
            <circleGeometry args={[1.9, 64]} />
            <MeshDistortMaterial
              color={template.props.innerColor || "#0030ff"}
              speed={template.props.innerSpeed || 5}
              distort={template.props.innerDistort || 0.2}
              radius={1}
              emissive={template.props.innerEmissive || "#0030ff"}
              emissiveIntensity={1}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      </group>
    );
  }
  
  if (template.type === 'energySphere') {
    return (
      <group position={template.props.position || [0, 0, 0]} rotation={template.props.rotation || [0, 0, 0]}>
        <TrailEffect 
          width={template.props.trailWidth || 0.3} 
          color={template.props.trailColor || "#00ffff"} 
          length={template.props.trailLength || 6}
        >
          <mesh>
            <sphereGeometry args={[template.props.radius || 0.5, 32, 32]} />
            <MeshDistortMaterial
              color={template.props.color || "#00ffff"}
              speed={template.props.speed || 3}
              distort={template.props.distort || 0.3}
              emissive={template.props.emissive || "#00ffff"}
              emissiveIntensity={2}
            />
          </mesh>
        </TrailEffect>
      </group>
    );
  }
  
  // Types standard étendus
  switch (template.type) {
    case 'mesh':
      return (
        <group ref={meshRef}>
          <mesh 
            position={template.props.position || [0, 0, 0]} 
            rotation={template.props.rotation || [0, 0, 0]}
            scale={template.props.scale}
          >
            <GeometryComponent 
              type={template.props.geometry.type} 
              args={template.props.geometry.args} 
            />
            <MaterialComponent 
              type={template.props.material.type} 
              props={template.props.material.props} 
              bg={template.props.material.bg}
              animationType={template.props.material.animation}
            />
          </mesh>
        </group>
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
          style={template.props.style || 'normal'}
          glowColor={template.props.glowColor}
          glowIntensity={template.props.glowIntensity || 0.5}
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
          style={template.props.style || 'normal'}
          glowColor={template.props.glowColor}
          glowIntensity={template.props.glowIntensity || 0.5} 
          interactive={template.props.interactive}
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
          style={template.props.style || 'normal'}
          glowColor={template.props.glowColor}
          glowIntensity={template.props.glowIntensity || 0.5}
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
          animationType={template.props.animationType}
        />
      );
    case 'light':
      if (template.props.lightType === 'point') {
        return (
          <pointLight 
            position={template.props.position || [0, 0, 0]} 
            color={template.props.color} 
            intensity={template.props.intensity} 
            distance={template.props.distance}
            castShadow={template.props.castShadow}
          />
        );
      } else if (template.props.lightType === 'spot') {
        return (
          <spotLight 
            position={template.props.position || [0, 0, 0]} 
            angle={template.props.angle || Math.PI/4}
            penumbra={template.props.penumbra || 0.5}
            color={template.props.color} 
            intensity={template.props.intensity} 
            distance={template.props.distance}
            castShadow={template.props.castShadow}
            target-position={template.props.target || [0, -1, 0]}
          />
        );
      } else if (template.props.lightType === 'directional') {
        return (
          <directionalLight 
            position={template.props.position || [0, 0, 0]} 
            color={template.props.color} 
            intensity={template.props.intensity}
            castShadow={template.props.castShadow}
          />
        );
      } else {
        return <ambientLight color={template.props.color} intensity={template.props.intensity} />;
      }
    case 'group':
      return (
        <group 
          position={template.props.position || [0, 0, 0]} 
          rotation={template.props.rotation || [0, 0, 0]}
          scale={template.props.scale}
        >
          {template.props.children?.map((child, index) => (
            <ObjectComponent key={index} template={child} />
          ))}
        </group>
      );
    default:
      return null;
  }
};

// Bibliothèque étendue d'objets 3D futuristes
const SceneObjects = ({ onAddContainer }) => {
  // Bibliothèque d'objets futuristes
  const objectTemplates = [
    // MATÉRIAUX ET FORMES AVANCÉES
    {
      "id": "mesh-glass-sphere",
      "name": "Sphère en verre futuriste",
      "type": "mesh",
      "props": {
        "position": [0, 0, 0],
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
          }
        }
      }
    },
    {
      "id": "mesh-holographic-cube",
      "name": "Cube holographique",
      "type": "mesh",
      "props": {
        "position": [0, 0, 0],
        "geometry": {
          "type": "box",
          "args": [1.5, 1.5, 1.5]
        },
        "material": {
          "type": "MeshPhysicalMaterial",
          "props": {
            "color": "#4080FF",
            "metalness": 0.9,
            "roughness": 0.2,
            "envMapIntensity": 1.5,
            "clearcoat": 1.0,
            "clearcoatRoughness": 0.1,
            "transmission": 0.5,
            "transparent": true,
            "opacity": 0.8
          },
          "animation": "pulsing"
        }
      }
    },
    {
      "id": "mesh-neon-torus",
      "name": "Tore Néon",
      "type": "mesh",
      "props": {
        "position": [0, 0, 0],
        "geometry": {
          "type": "torus",
          "args": [1, 0.4, 32, 100]
        },
        "material": {
          "type": "MeshStandardMaterial",
          "props": {
            "color": "#ff00ff",
            "emissive": "#ff00ff",
            "emissiveIntensity": 2,
            "metalness": 0.5,
            "roughness": 0.2
          },
          "animation": "pulsing"
        }
      }
    },
    {
      "id": "mesh-crystal-dodecahedron",
      "name": "Cristal Dodécaèdre",
      "type": "mesh",
      "props": {
        "position": [0, 0, 0],
        "geometry": {
          "type": "dodecahedron",
          "args": [1.2, 0]
        },
        "material": {
          "type": "MeshPhysicalMaterial",
          "props": {
            "color": "#00ffcc",
            "metalness": 0.1,
            "roughness": 0.0,
            "transmission": 0.95,
            "thickness": 0.5,
            "envMapIntensity": 2,
            "clearcoat": 1,
            "clearcoatRoughness": 0.1,
            "ior": 1.8
          }
        }
      }
    },
    
    // TEXTE FUTURISTE
    {
      "id": "futuristic-text-floating",
      "name": "Texte flottant",
      "type": "meshText",
      "props": {
        "content": "FUTURISTIC",
        "position": [0, 0, 0],
        "color": "#00ffff",
        "fontSize": 0.8,
        "style": "floating",
        "glowColor": "#00ffff",
        "glowIntensity": 0.8
      }
    },
    {
      "id": "futuristic-text-billboard",
      "name": "Texte orienté caméra",
      "type": "meshText",
      "props": {
        "content": "HOLOGRAM",
        "position": [0, 0, 0],
        "color": "#ff00ff",
        "fontSize": 0.8,
        "style": "billboard",
        "glowColor": "#ff00ff",
        "glowIntensity": 0.6,
        "bg": "rgba(20, 0, 40, 0.5)"
      }
    },
    
    // IMAGES FUTURISTES
    {
      "id": "futuristic-image-floating",
      "name": "Image flottante",
      "type": "meshImage",
      "props": {
        "url": "https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX35634371.jpg",
        "position": [0, 0, 0],
        "style": "floating",
        "glowColor": "#40a0ff"
      }
    },
    {
      "id": "futuristic-image-reflected",
      "name": "Image avec réflexion",
      "type": "meshImage",
      "props": {
        "url": "https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX35634371.jpg",
        "position": [0, 0, 0],
        "style": "reflected"
      }
    },
    
    // VIDÉOS FUTURISTES
    {
      "id": "futuristic-video-floating",
      "name": "Vidéo flottante",
      "type": "meshVideo",
      "props": {
        "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "position": [0, 0, 0],
        "style": "floating",
        "glowColor": "#60ff80"
      }
    },
    {
      "id": "futuristic-video-reflected",
      "name": "Vidéo avec réflexion",
      "type": "meshVideo",
      "props": {
        "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "position": [0, 0, 0],
        "style": "reflected",
        "bg": "rgba(0, 0, 0, 0.5)"
      }
    },
    
    // MODÈLES 3D FUTURISTES
    {
      "id": "futuristic-model-glowing",
      "name": "Modèle lumineux",
      "type": "meshModel",
      "props": {
        "url": "3D/objs/911-transformed.glb",
        "position": [0, 0, 0],
        "animationType": "glowing"
      }
    },
    {
      "id": "futuristic-model-floating",
      "name": "Modèle flottant",
      "type": "meshModel",
      "props": {
        "url": "3D/objs/911-transformed.glb",
        "position": [0, 0, 0],
        "animationType": "floating"
      }
    },
    
    // ÉCLAIRAGE FUTURISTE
    {
      "id": "light-volumetric",
      "name": "Lumière volumétrique",
      "type": "light",
      "props": {
        "lightType": "spot",
        "color": "#4060FF",
        "intensity": 5,
        "distance": 15,
        "angle": 0.4,
        "penumbra": 0.8,
        "position": [2, 5, 2],
        "target": [0, 0, 0],
        "castShadow": true
      }
    },
    {
      "id": "light-ambient-scifi",
      "name": "Ambiance Sci-Fi",
      "type": "light",
      "props": {
        "lightType": "ambient",
        "color": "#203060",
        "intensity": 0.6
      }
    },
    
    // ÉLÉMENTS SPÉCIAUX FUTURISTES
    {
      "id": "portal-effect",
      "name": "Portail dimensionnel",
      "type": "portal",
      "props": {
        "position": [0, 0, 0],
        "color": "#8060ff",
        "innerColor": "#0030ff",
        "speed": 2,
        "distort": 0.4,
        "innerSpeed": 5,
        "innerDistort": 0.2
      }
    },
    {
      "id": "energy-sphere",
      "name": "Sphère d'énergie",
      "type": "energySphere",
      "props": {
        "position": [0, 0, 0],
        "radius": 0.7,
        "color": "#00ffff",
        "speed": 3,
        "distort": 0.3,
        "trailColor": "#00ffff",
        "trailWidth": 0.3,
        "trailLength": 6
      }
    },
    {
      "id": "hologram-projection",
      "name": "Projection holographique",
      "type": "hologram",
      "props": {
        "position": [0, 0, 0],
        "geometryType": "icosahedron",
        "args": [1.2, 1],
        "scale": [1, 1, 1]
      }
    },
    {
      "id": "particle-field",
      "name": "Champ de particules",
      "type": "particles",
      "props": {
        "count": 300,
        "color": "#88ccff",
        "size": 0.02,
        "area": [10, 5, 10]
      }
    },
    
    // COMBINAISONS ET GROUPES
    {
      "id": "futuristic-display-stand",
      "name": "Socle d'exposition futuriste",
      "type": "group",
      "props": {
        "position": [0, 0, 0],
        "children": [
          {
            "type": "mesh",
            "props": {
              "position": [0, -0.5, 0],
              "geometry": {
                "type": "cylinder",
                "args": [1.5, 2, 0.2, 32]
              },
              "material": {
                "type": "MeshStandardMaterial",
                "props": {
                  "color": "#202040",
                  "emissive": "#304060",
                  "emissiveIntensity": 0.5,
                  "metalness": 0.8,
                  "roughness": 0.2
                }
              }
            }
          },
          {
            "type": "light",
            "props": {
              "lightType": "point",
              "position": [0, 0.5, 0],
              "color": "#60a0ff",
              "intensity": 1,
              "distance": 5
            }
          },
          {
            "type": "energySphere",
            "props": {
              "position": [0, 1, 0],
              "radius": 0.5,
              "color": "#60ffff",
              "speed": 2,
              "distort": 0.2
            }
          }
        ]
      }
    },
    {
      "id": "futuristic-info-panel",
      "name": "Panneau d'information",
      "type": "group",
      "props": {
        "position": [0, 0, 0],
        "children": [
          {
            "type": "mesh",
            "props": {
              "position": [0, 0, -0.05],
              "geometry": {
                "type": "plane",
                "args": [4, 2.5]
              },
              "material": {
                "type": "MeshStandardMaterial",
                "props": {
                  "color": "#000a20",
                  "emissive": "#000a20",
                  "metalness": 0.8,
                  "roughness": 0.2
                }
              }
            }
          },
          {
            "type": "meshText",
            "props": {
              "content": "STATUS: ONLINE",
              "position": [0, 0.8, 0],
              "color": "#00ffaa",
              "fontSize": 0.25,
              "glowColor": "#00ffaa",
              "glowIntensity": 0.5
            }
          },
          {
            "type": "meshText",
            "props": {
              "content": "WELCOME",
              "position": [0, 0.2, 0],
              "color": "#ffffff",
              "fontSize": 0.5,
              "glowColor": "#4080ff",
              "glowIntensity": 0.3
            }
          },
          {
            "type": "mesh",
            "props": {
              "position": [0, -0.6, 0],
              "geometry": {
                "type": "torus",
                "args": [0.5, 0.1, 16, 50]
              },
              "material": {
                "type": "MeshStandardMaterial",
                "props": {
                  "color": "#40a0ff",
                  "emissive": "#40a0ff",
                  "emissiveIntensity": 1,
                  "metalness": 0.5,
                  "roughness": 0.3
                },
                "animation": "pulsing"
              }
            }
          }
        ]
      }
    },
    {
      "id": "virtual-interface",
      "name": "Interface virtuelle",
      "type": "group",
      "props": {
        "position": [0, 0, 0],
        "children": [
          {
            "type": "meshImage",
            "props": {
              "url": "https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX35634371.jpg",
              "position": [-2, 0, 0],
              "scale": [0.6, 0.6, 0.6],
              "glowColor": "#60a0ff",
              "rotation": [0, -0.1, 0]
            }
          },
          {
            "type": "meshText",
            "props": {
              "content": "DATA VISUALIZATION",
              "position": [0, 1.2, 0],
              "color": "#ffffff",
              "fontSize": 0.3,
              "bg": "rgba(0, 20, 40, 0.7)",
              "glowColor": "#60a0ff",
              "glowIntensity": 0.3
            }
          },
          {
            "type": "meshVideo",
            "props": {
              "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              "position": [2, 0, 0],
              "scale": [0.6, 0.6, 0.6],
              "rotation": [0, 0.1, 0]
            }
          },
          {
            "type": "mesh",
            "props": {
              "position": [0, 0, 0],
              "geometry": {
                "type": "torus",
                "args": [0.5, 0.05, 16, 50]
              },
              "material": {
                "type": "MeshStandardMaterial",
                "props": {
                  "color": "#40a0ff",
                  "emissive": "#40a0ff",
                  "emissiveIntensity": 1,
                  "metalness": 0.5,
                  "roughness": 0.3
                },
                "animation": "pulsing"
              }
            }
          }
        ]
      }
    }
  ];

  const renderPreview = (template) => {
    return (
      <div style={{ width: 200, height: 200, border: '1px solid #101030', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,60,255,0.2)' }}>
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
    <div style={{ background: 'linear-gradient(to bottom, #0c1016, #162032)', padding: '20px', borderRadius: '12px' }}>
      <h3 style={{ color: '#60a0ff', textAlign: 'center', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>
        Bibliothèque d'objets futuristes
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", justifyContent: "center" }}>
        {objectTemplates.map((template) => (
          <div key={template.id} style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            background: 'rgba(10, 20, 40, 0.7)',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 5px 20px rgba(0, 100, 255, 0.15)',
            border: '1px solid rgba(60, 120, 255, 0.3)',
            transition: 'all 0.3s ease'
          }}>
            {renderPreview(template)}
            <span style={{ 
              margin: "12px 0", 
              fontWeight: "600", 
              color: '#ffffff', 
              fontFamily: 'Arial, sans-serif', 
              fontSize: '14px',
              textAlign: 'center',
              textShadow: '0 0 10px rgba(60, 140, 255, 0.6)'
            }}>
              {template.name}
            </span>
            <button
              style={{
                padding: "8px 16px",
                background: "linear-gradient(135deg, #4080ff, #60a0ff)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                boxShadow: "0 2px 10px rgba(0, 100, 255, 0.3)",
                transition: "all 0.2s ease",
                fontSize: "12px"
              }}
              onClick={() => onAddContainer(template)}
              onMouseOver={(e) => {
                e.target.style.background = "linear-gradient(135deg, #60a0ff, #40c0ff)";
                e.target.style.boxShadow = "0 4px 15px rgba(0, 140, 255, 0.5)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "linear-gradient(135deg, #4080ff, #60a0ff)";
                e.target.style.boxShadow = "0 2px 10px rgba(0, 100, 255, 0.3)";
              }}
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