// MainLens.js
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Rnd } from "react-rnd";
import Container from "./projetMakerCentral/components/Container";
import MeshLens from "./projetMakerCentral/components/MeshLens";
import Label from './Dashboard';
import './ProjetMaker.css';
import { Link, NavLink } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import isEqual from "lodash.isequal";

const userString = localStorage.getItem('digiliaUser');
const userProfil = JSON.parse(userString);

// Configuration responsive
const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024
};

const cssFields = [
  'width', 'height', 'backgroundColor', 'color', 
  'padding', 'margin', 'borderRadius', 'border',
  'display', 'flexDirection', 'justifyContent', 'alignItems'
];

const ProjetPage = () => {
  // [Les autres états et fonctions existants restent inchangés...]

  // Nouvel état pour le responsive
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Déterminer le type d'appareil
  const getDeviceType = () => {
    if (windowSize.width <= breakpoints.mobile) return 'mobile';
    if (windowSize.width <= breakpoints.tablet) return 'tablet';
    return 'desktop';
  };

  // Styles responsive
  const responsiveStyles = {
    container: {
      mobile: { width: '100%', padding: '10px' },
      tablet: { width: '90%', padding: '15px' },
      desktop: { width: '80%', padding: '20px' }
    },
    component: {
      mobile: { margin: '5px 0' },
      tablet: { margin: '10px 0' },
      desktop: { margin: '15px 0' }
    }
  };

  // RenderComponent amélioré et responsive
  const renderComponent = (component) => {
    const deviceType = getDeviceType();
    const baseStyle = {
      position: 'relative',
      border: selectedComponent?.id === component.id 
        ? '2px solid #00aaff' 
        : '1px solid #ddd',
      transition: 'all 0.3s ease',
      ...responsiveStyles.component[deviceType],
      ...(component.props?.style || {})
    };

    return (
      <div 
        key={component.id}
        style={baseStyle}
        onClick={() => selectComponent(component.id)}
        onMouseEnter={() => setHoveredContainerId(component.id)}
        onMouseLeave={() => setHoveredContainerId(null)}
      >
        {/* Contenu du composant */}
        <div style={{ padding: '10px' }}>
          {component.type === 'container' && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '10px'
            }}>
              {component.children?.map(child => renderComponent(child))}
            </div>
          )}
          
          {component.type === 'meshLens' && (
            <div style={{
              width: '100%',
              height: '300px',
              backgroundColor: '#0f0f12',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white'
            }}>
              <Canvas>
                <MeshLens />
              </Canvas>
            </div>
          )}
        </div>

        {/* Overlay d'édition */}
        {(hoveredContainerId === component.id || selectedComponent?.id === component.id) && (
          <div style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            display: 'flex',
            gap: '5px',
            zIndex: 10
          }}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate();
              }}
              style={{
                background: '#e4eb8e',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 5px',
                cursor: 'pointer'
              }}
            >
              ⎘
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeParent(component.id);
              }}
              style={{
                background: '#ff6b6b',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 5px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  };

  // PropertyEditor amélioré avec UI intuitive
  const PropertyEditor = () => {
    if (!selectedComponent) return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: '#666'
      }}>
        Sélectionnez un composant pour modifier ses propriétés
      </div>
    );

    const handleStyleChange = (key, value) => {
      const newStyle = { ...localStyle, [key]: value };
      setLocalStyle(newStyle);
      updateComponentProps(selectedComponent.id, { style: newStyle });
    };

    const handlePropChange = (key, value) => {
      const newProps = { ...localProps, [key]: value };
      setLocalProps(newProps);
      updateComponentProps(selectedComponent.id, newProps);
    };

    return (
      <div style={{ 
        padding: '15px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ 
          marginBottom: '15px',
          color: '#00aaff',
          borderBottom: '1px solid #eee',
          paddingBottom: '10px'
        }}>
          Éditeur de propriétés
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Type: {selectedComponent.type}</h4>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <button
              onClick={() => removeParent(selectedComponent.id)}
              style={{ 
                backgroundColor: '#ff6b6b', 
                color: 'white',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                gridColumn: '1 / -1'
              }}
            >
              Supprimer ce composant
            </button>
          </div>
        </div>

        {/* Propriétés générales */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Propriétés</h4>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '10px'
          }}>
            {Object.entries(localProps).map(([key, value]) => (
              <div key={key}>
                <label style={{ 
                  display: 'block',
                  fontSize: '0.8rem',
                  marginBottom: '4px',
                  color: '#666'
                }}>
                  {key}
                </label>
                <input
                  type="text"
                  value={value || ''}
                  onChange={(e) => handlePropChange(key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Styles CSS */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Styles</h4>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '10px'
          }}>
            {cssFields.map((key) => (
              <div key={key}>
                <label style={{ 
                  display: 'block',
                  fontSize: '0.8rem',
                  marginBottom: '4px',
                  color: '#666'
                }}>
                  {key}
                </label>
                <input
                  type="text"
                  value={localStyle[key] || ''}
                  onChange={(e) => handleStyleChange(key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gestion des enfants */}
        {selectedComponent.children && selectedComponent.children.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '10px' }}>Enfants ({selectedComponent.children.length})</h4>
            <div style={{ 
              border: '1px solid #eee',
              borderRadius: '4px',
              padding: '10px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {selectedComponent.children.map((child) => (
                <div key={child.id} style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px',
                  borderBottom: '1px solid #f5f5f5'
                }}>
                  <span style={{ fontSize: '0.9rem' }}>
                    {child.type} - {child.id.slice(0, 6)}...
                  </span>
                  <button
                    onClick={() => removeChildFromContainer(selectedComponent.id, child.id)}
                    style={{ 
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Actions</h4>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '10px'
          }}>
            <button 
              onClick={handleDuplicate}
              disabled={!selectedComponent}
              style={{ 
                backgroundColor: '#e4eb8e',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Dupliquer
            </button>
            <button 
              onClick={handleMoveMode} 
              disabled={!selectedComponent}
              style={{ 
                backgroundColor: '#a5d8ff',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Déplacer
            </button>
          </div>
        </div>
      </div>
    );
  };

  // [Le reste du code reste inchangé...]

  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* [Le reste du JSX reste inchangé...] */}
      
      {/* Modifier la partie d'affichage principale pour être responsive */}
      <div className="container-middle-projet-maker" style={{ 
        flex: 1,
        padding: getDeviceType() === 'mobile' ? '10px' : '20px'
      }}>
        <div className='container-middle-projet-maker-content' style={{
          maxWidth: responsiveStyles.container[getDeviceType()].width,
          margin: '0 auto',
          padding: responsiveStyles.container[getDeviceType()].padding
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {components.map((component) => renderComponent(component))}
          </div>
        </div>
        
        {/* [Le reste du JSX reste inchangé...] */}
      </div>
    </div>
  );
};

export default ProjetPage;