import React from 'react';
import './ComponentFooter.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container" id='contact'>
        <div className="footer-section">
          <h3>À propos de Digilia</h3>
          <p>Digilia offre des solutions innovantes pour la création de sites web et la digitalisation des entreprises.</p>
        </div>
        <div className="footer-section">
          <h3>Liens rapides</h3>
          <ul>
            <li><a href="#hero">Accueil</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contactez-nous</h3>
          <p>Email: christiantukundastocklin@gmail.com</p>
          <p>Téléphone: +212 63 46 99 940</p>
          <p>Adresse: L020 Rue Gauthier, Casablanca</p>
        </div>
        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-links">
            <a href="https://www.tiktok.com/@christian_tukunda" target="_blank" rel="noopener noreferrer">Tiktok</a>
            <a href="https://www.instagram.com/christian_tukunda" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://facebook.com/christiantukundas" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://twitter.com/christiantukunda" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com/christiantukunda" target="_blank" rel="noopener noreferrer">LinkedIn</a>
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
