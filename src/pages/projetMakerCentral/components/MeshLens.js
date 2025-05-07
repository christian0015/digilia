import * as THREE from 'three';
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { 
  Canvas, 
  createPortal, 
  useFrame, 
  useThree, 
  useLoader 
} from '@react-three/fiber';
import { 
  useFBO, 
  useGLTF, 
  useScroll, 
  Text, 
  Image, 
  Scroll, 
  Preload, 
  ScrollControls, 
  MeshTransmissionMaterial,
  PerspectiveCamera,
  Environment,
  OrbitControls,
  Float,
  Trail,
  Sparkles,
  Billboard,
  Reflector
} from '@react-three/drei';
import { easing } from 'maath';


// Composant Accordion
const Accordion = ({ position, width, items }) => {
  return (
    <group position={position}>
      {items.map((item, index) => (
        <group key={index} position={[0, -index * 0.5, 0]}>
          <Text
            font="/fonts/Exo-Bold.woff"
            color="#00aaff"
            fontSize={0.25}
            children={item.title}
          />
          <Text
            position={[0, -0.3, 0]}
            font="/fonts/Inter-Regular.woff"
            color="#cccccc"
            fontSize={0.2}
            maxWidth={width}
            children={item.content}
          />
        </group>
      ))}
    </group>
  );
};

// Composant Form
const Form = ({ position, width, fields }) => {
  return (
    <group position={position}>
      {fields.map((field, index) => (
        <group key={field.id} position={[0, -index * 0.4, 0]}>
          <Text
            font="/fonts/Inter-Regular.woff"
            color="#ffffff"
            fontSize={0.2}
            children={field.label}
          />
          <mesh position={[0, -0.15, 0]}>
            <planeGeometry args={[width, 0.3]} />
            <meshStandardMaterial color="#1a1a24" />
          </mesh>
        </group>
      ))}
      <InteractiveElement
        position={[0, -fields.length * 0.4 - 0.3, 0]}
        width={width}
        height={0.5}
        color="#00aaff"
        hoverColor="#00ccff"
        borderRadius={0.1}
      >
        <Text
          font="/fonts/Exo-Bold.woff"
          color="#ffffff"
          fontSize={0.2}
          children="SEND INQUIRY"
        />
      </InteractiveElement>
    </group>
  );
};

// Composant Icon
const Icon = ({ name, color, hoverColor, size, onClick }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Text
      font="/icons.ttf"
      color={hovered ? hoverColor : color}
      fontSize={size}
      children={name}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    />
  );
};

const FuturaScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }}>
      <color attach="background" args={['#0f0f12']} />
      <ScrollControls damping={0.2} pages={3} distance={0.5}>
        <Suspense fallback={<LoadingFallback />}>
          <Lens>
            <Scroll>
              <Header />
              <Hero />
              <Description />
              <Footer />
            </Scroll>
            <Preload />
          </Lens>
        </Suspense>
      </ScrollControls>
    </Canvas>
  );
};

// Simple loading fallback component
function LoadingFallback() {
  return (
    <Text
      position={[0, 0, 0]}
      color="#ffffff"
      fontSize={0.5}
      children="Loading..."
    />
  );
}

function Lens({ children, damping = 0.15, ...props }) {
  const ref = useRef();
  const buffer = useFBO();
  const viewport = useThree((state) => state.viewport);
  const [scene] = useState(() => new THREE.Scene());
  
  // Using a simple cylinder geometry instead of relying on a 3D model
  // This is the fix for the error "Cannot read properties of undefined (reading 'geometry')"
  useFrame((state, delta) => {
    const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 15]);
    if (ref.current) {
      easing.damp3(
        ref.current.position,
        [(state.pointer.x * viewport.width) / 2, (state.pointer.y * viewport.height) / 2, 15],
        damping,
        delta
      );
    }
    
    state.gl.setRenderTarget(buffer);
    state.gl.setClearColor('#0f0f12');
    state.gl.render(scene, state.camera);
    state.gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} />
      </mesh>
      <mesh scale={0.25} ref={ref} rotation-x={Math.PI / 2} {...props}>
        {/* Using a simple cylinder geometry instead of the model's geometry */}
        <cylinderGeometry args={[3, 3, 0.5, 64]} />
        <MeshTransmissionMaterial 
          buffer={buffer.texture} 
          ior={1.2} 
          thickness={1.5} 
          anisotropy={0.1} 
          chromaticAberration={0.04} 
        />
      </mesh>
    </>
  );
}

function Header() {
  const { width } = useThree((state) => state.viewport);
  
  return (
    <group position={[0, 1.8, 0]}>
      {/* Navigation */}
      <FlexContainer position={[0, 0, 5]} justifyContent="space-between">
        {/* Logo */}
        <Text
          position={[-width/2 + 1, 0, 0]}
          font="/fonts/Exo-Bold.woff"
          color="#00ffff"
          fontSize={0.5}
          children="FUTURA"
        >
          <meshStandardMaterial emissive="#00aaff" emissiveIntensity={2.5} />
        </Text>
        
        {/* Nav Links */}
        <FlexContainer direction="row" gap={1.2} position={[width/2 - 3, 0, 0]}>
          {['HOME', 'PRODUCTS', 'ABOUT', 'CONTACT'].map((item, i) => (
            <InteractiveText
              key={i}
              content={item}
              font="/fonts/Exo-Regular.woff"
              color="#ffffff"
              hoverColor="#00ffff"
              fontSize={0.25}
            />
          ))}
        </FlexContainer>
      </FlexContainer>
    </group>
  );
}

function Hero() {
  const data = useScroll();
  const group = useRef();
  const model = useRef();
  
  useFrame(() => {
    if (model.current) {
      model.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={group}>
      {/* Hero Text */}
      <group position={[-3, 0, 10]}>
        <Text
          font="/fonts/Exo-ExtraBold.woff"
          color="#ffffff"
          fontSize={1}
          letterSpacing={-0.05}
          lineHeight={1.2}
          children="FUTURE IN MOTION"
        />
        <Text
          position={[0, -1.2, 0]}
          font="/fonts/Inter-Regular.woff"
          color="#cccccc"
          fontSize={0.3}
          maxWidth={5}
          children="Experience driving reimagined, elevate your journey to the next level"
        />
      </group>
      
      {/* 3D Model */}
      <group ref={model} position={[3, -0.5, 8]} rotation={[0, -0.3, 0]} scale={0.4}>
        <Suspense fallback={null}>
          <CarModel />
        </Suspense>
      </group>
    </group>
  );
}

// Separate Car model component with error handling
function CarModel() {
  const [modelError, setModelError] = useState(false);
  
  // Always call the hook, regardless of whether it succeeds or fails
  const { scene } = useGLTF('/3D/objs/911-transformed.glb', undefined, 
    (error) => {
      console.error("Error loading 3D model:", error);
      setModelError(true);
    }
  );
  
  // Return fallback if there was an error
  if (modelError) {
    return (
      <group>
        {/* Simple car body */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[4, 1, 2]} />
          <meshStandardMaterial color="#202030" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Car roof */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[2, 0.8, 1.8]} />
          <meshStandardMaterial color="#202030" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Wheels */}
        <Wheel position={[1.5, 0, 1]} />
        <Wheel position={[1.5, 0, -1]} />
        <Wheel position={[-1.5, 0, 1]} />
        <Wheel position={[-1.5, 0, -1]} />
      </group>
    );
  }
  
  // If no error, return the model
  return <primitive object={scene} />;
}

// Simple wheel component for the fallback car
function Wheel({ position }) {
  return (
    <mesh position={position} rotation={[Math.PI/2, 0, 0]}>
      <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
  );
}

function Description() {
  const data = useScroll();
  const group = useRef();
  
  useFrame(() => {
    const zoom = 1 + data.range(0.5, 1.2) * 0.15;
    if (group.current && group.current.children[0]) {
      group.current.children[0].scale.set(zoom * 4, zoom * 2.25, 1);
    }
  });

  return (
    <group ref={group}>
      {/* Video Section - Using a placeholder instead */}
      <mesh position={[-2.5, 0, 10]} scale={[4, 2.25, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#1a1a24" />
        <Text
          position={[0, 0, 0.1]}
          font="/fonts/Inter-Regular.woff"
          color="#ffffff"
          fontSize={0.3}
          children="VIDEO SHOWCASE"
        />
      </mesh>
      
      {/* CTA Button */}
      <InteractiveElement
        position={[-2.5, -1.5, 10.1]}
        width={2}
        height={0.6}
        color="#00aaff"
        hoverColor="#00ffff"
        borderRadius={0.1}
      >
        <Text
          font="/fonts/Exo-Bold.woff"
          color="#000000"
          fontSize={0.25}
          letterSpacing={0.05}
          children="WATCH FEATURE"
        />
      </InteractiveElement>
      
      {/* Product Details */}
      <group position={[2.5, 0.2, 10]}>
        <Text
          font="/fonts/Exo-Bold.woff"
          color="#00aaff"
          fontSize={0.4}
          letterSpacing={-0.02}
          children="TECHNICAL EXCELLENCE"
        />
        <Text
          position={[0, -1, 0]}
          font="/fonts/Inter-Regular.woff"
          color="#dddddd"
          fontSize={0.22}
          maxWidth={4}
          lineHeight={1.5}
          children="With a top speed of 330 km/h and 0-100 km/h in just 2.8 seconds, the 911 Turbo S represents the pinnacle of automotive engineering."
        />
      </group>
      
      {/* Price Section */}
      <group position={[2.5, -2.2, 10]}>
        <mesh position={[-1.8, 0, 0]} scale={[0.8, 0.8, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#25D366" />
          <Text
            position={[0, 0, 0.1]}
            font="/fonts/Exo-Bold.woff"
            color="#ffffff"
            fontSize={0.2}
            children="SALE"
          />
        </mesh>
        <Text
          position={[-0.8, 0, 0]}
          font="/fonts/Exo-ExtraBold.woff"
          color="#ffffff"
          fontSize={0.4}
          children="$215,000"
        />
        <InteractiveElement
          position={[1, 0, 0]}
          width={2.5}
          height={0.6}
          color="#25D366"
          hoverColor="#128C7E"
          borderRadius={0.1}
        >
          <Text
            font="/fonts/Exo-Bold.woff"
            color="#ffffff"
            fontSize={0.2}
            letterSpacing={0.03}
            children="INQUIRE VIA WHATSAPP"
          />
        </InteractiveElement>
      </group>
    </group>
  );
}

function Footer() {
  return (
    <group position={[0, -3, 10]}>
      {/* FAQ Section */}
      <Accordion 
        position={[-2.5, 0, 0]} 
        width={4}
        items={[
          { title: "Delivery Information", content: "Standard delivery takes 6-8 weeks." },
          { title: "Warranty Details", content: "4-year/50,000 mile warranty." },
          { title: "Financing Options", content: "Flexible financing options." }
        ]}
      />
      
      {/* Contact Form */}
      <Form 
        position={[2.5, 0, 0]} 
        width={4}
        fields={[
          { id: "name", type: "text", label: "Full Name" },
          { id: "email", type: "email", label: "Email" },
          { id: "message", type: "textarea", label: "Message" }
        ]}
      />
      
      {/* Social Links */}
      <FlexContainer position={[0, -3, 0]} direction="row" gap={1}>
        {['instagram', 'facebook', 'twitter', 'youtube'].map((icon, i) => (
          <Icon 
            key={i}
            name={icon}
            color="#ffffff"
            hoverColor="#00aaff"
            size={0.5}
          />
        ))}
      </FlexContainer>
      
      {/* Copyright */}
      <Text
        position={[0, -3.8, 0]}
        font="/fonts/Inter-Regular.woff"
        color="#666666"
        fontSize={0.15}
        letterSpacing={0.02}
        children="© 2025 FUTURA AUTOMOTIVE. ALL RIGHTS RESERVED."
      />
    </group>
  );
}

// Helper Components
function FlexContainer({ position = [0, 0, 0], direction = 'row', gap = 0, justifyContent = 'flex-start', children }) {
  return (
    <group position={position}>
      {React.Children.map(children, (child, i) => {
        const offset = direction === 'row' 
          ? [i * gap, 0, 0] 
          : [0, -i * gap, 0];
        return React.cloneElement(child, { position: offset });
      })}
    </group>
  );
}

function InteractiveText({ content, font, color, hoverColor, fontSize, position = [0, 0, 0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Text
      position={position}
      font={font}
      color={hovered ? hoverColor : color}
      fontSize={fontSize}
      children={content}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

function InteractiveElement({ position, width, height, color, hoverColor, borderRadius, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={position}>
      <mesh 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={hovered ? hoverColor : color} />
      </mesh>
      <group position={[0, 0, 0.01]}>
        {children}
      </group>
    </group>
  );
}

// Properly structured Model component that follows React Hooks rules
function Model({ url }) {
  const [loadError, setLoadError] = useState(false);
  
  // Always call useGLTF, even if there's an error
  const { scene } = useGLTF(url, undefined, 
    (error) => {
      console.error("Failed to load model:", error);
      setLoadError(true);
    }
  );
  
  if (loadError) {
    return null;
  }
  
  return <primitive object={scene} />;
}

// This component has been simplified to avoid requiring a video file
function Video({ url, position, scale }) {
  return (
    <mesh position={position} scale={scale}>
      <planeGeometry />
      <meshBasicMaterial color="#1a1a24" />
      <Text
        position={[0, 0, 0.1]}
        font="/fonts/Inter-Regular.woff"
        color="#ffffff"
        fontSize={0.3}
        children="VIDEO PLAYER"
      />
    </mesh>
  );
}

export default FuturaScene;