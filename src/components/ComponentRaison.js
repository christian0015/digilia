import React, { useState, useEffect, useRef  } from 'react';
import './ComponentRaison.css';
import AOS from 'aos'; // Importation AOS

const points = [
  {
    title: 'Innovation',
    description: 'Digilia utilise les technologies les plus récentes pour offrir des solutions innovantes et modernes.'
  },
  {
    title: 'Expérience Utilisateur',
    description: 'Nous nous concentrons sur l\'expérience utilisateur pour garantir une navigation fluide et agréable.'
  },
  {
    title: 'Support et Maintenance',
    description: 'Nous offrons un support continu et une maintenance régulière pour assurer que votre site reste à jour et sécurisé.'
  },
  {
    title: 'Personnalisation',
    description: 'Chaque solution est personnalisée pour répondre aux besoins spécifiques de votre entreprise.'
  },
  {
    title: 'Optimisation SEO',
    description: 'Nos sites sont optimisés pour les moteurs de recherche pour améliorer votre visibilité en ligne.'
  },
  {
    title: 'Tarifs Compétitifs',
    description: 'Nous offrons des tarifs compétitifs sans compromettre la qualité de nos services.'
  },
];

const PourquoiChoisirDigilia = () => {
    useEffect(() => {
        AOS.init();
      }, []);
  return (
    <div className="choisir-container">
      <h2 className="choisir-title">Pourquoi Choisir Digilia ?</h2>
      <div className="choisir-list">
        {points.map((point, index) => (
          <div className="choisir-item" key={index} data-aos="fade-up" data-aos-duration="550">
            <h3 className="choisir-name">{point.title}</h3>
            <p className="choisir-description">{point.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PourquoiChoisirDigilia;
