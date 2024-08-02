import React from 'react';
import './ComponentService.css';

const services = [
  {
    title: 'Création de sites web',
    description: 'Nous créons des sites web modernes et responsives pour votre entreprise.',
    icon: '🌐',
  },
  {
    title: 'Solutions 3D',
    description: 'Découvrez nos solutions 3D innovantes pour un impact visuel maximal.',
    icon: '🎨',
  },
  {
    title: 'Digitalisation',
    description: 'Nous aidons à digitaliser votre entreprise pour atteindre un public plus large.',
    icon: '💻',
  },
  {
    title: 'Support et Maintenance',
    description: 'Nous offrons un support continu pour assurer que votre site web reste à jour et sécurisé.',
    icon: '🔧',
  },
  {
    title: 'Marketing Digital',
    description: 'Optimisez votre présence en ligne avec nos services de marketing digital.',
    icon: '📈',
  },
  {
    title: 'SEO',
    description: 'Améliorez votre visibilité sur les moteurs de recherche grâce à nos stratégies SEO.',
    icon: '🔍',
  },
];

const ComponentService = () => {
  return (
    <div className="service-container">
      <h2 className="service-title">Nos Services</h2>
      <div className="service-list">
        {services.map((service, index) => (
          <div className="service-item" key={index}>
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-name">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentService;
