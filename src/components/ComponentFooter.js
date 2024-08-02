import React from 'react';
import './ComponentFooter.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>À propos de Digilia</h3>
          <p>Digilia offre des solutions innovantes pour la création de sites web et la digitalisation des entreprises.</p>
        </div>
        <div className="footer-section">
          <h3>Liens rapides</h3>
          <ul>
            <li><a href="#home">Accueil</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contactez-nous</h3>
          <p>Email: contact@digilia.com</p>
          <p>Téléphone: +123 456 7890</p>
          <p>Adresse: 123 Rue de l'Innovation, Casablanca</p>
        </div>
        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Digilia. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
