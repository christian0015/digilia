import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import './App.css';
import AOS from 'aos'; // Importation AOS
import TypeWriterComponent from './components/TypeWriterComponent';
import ComponentService from './components/ComponentService';
import ComponentRaison from './components/ComponentRaison';
import ComponentTemoignage from './components/ComponentTemoignage';
import ComponentFooter from './components/ComponentFooter';


import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
// import ProjetPage from './pages/ProjetMaker';
import ProjetPage from './pages/Main';


function Marquee() {
  const initialItems = [
    "icons/congo/visa-card.png",
    "icons/googlefont.png",
    "icons/google.png",
    "icons/spline.png",
    "icons/react.png",
    "icons/wixstudio.png",
    "icons/webflow.png",
    "icons/blender.png",
    "icons/aws.png",
    "icons/congo/orange-money.png",
    "icons/congo/mastercard.png",
    "icons/wordpress.png",
    "icons/aws.png"
  ];

  const [items, setItems] = useState(initialItems);

  const marqueeRef = useRef(null);

  // Fonction pour réorganiser les éléments
  const updateItems = () => {
    if (marqueeRef.current) {
      const marqueeWidth = marqueeRef.current.offsetWidth;
      const contentWidth = marqueeRef.current.scrollWidth;
      const scrollLeft = marqueeRef.current.scrollLeft;

      if (scrollLeft >= contentWidth / 2) {
        setItems(prevItems => [...prevItems.slice(1), prevItems[0]]);
        marqueeRef.current.scrollLeft = 0; // Réinitialiser la position du scroll
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(updateItems, 50); // Vérifier la chaine marquee
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="marquee-wrapper">
      <div className="marquee-content" ref={marqueeRef}>
        {items.map((item, index) => (
          <div className="marquee-item" key={index}>
            <img src={item} alt="itemMarquee"/>
          </div>
        ))}
        {items.map((item, index) => (
          <div className="marquee-item" key={`clone-${index}`}>
            <img src={item} alt="itemMarquee"/>
          </div>
        ))}{items.map((item, index) => (
          <div className="marquee-item" key={`clone-${index}`}>
            <img src={item} alt="itemMarquee"/>
          </div>
        ))}
        {items.map((item, index) => (
          <div className="marquee-item" key={`clone-${index}`}>
            <img src={item} alt="itemMarquee"/>
          </div>
        ))}
          {items.map((item, index) => (
          <div className="marquee-item" key={`clone-${index}`}>
            <img src={item} alt="itemMarquee"/>
          </div>
        ))}
      </div>
    </div>
  );
}



function App() {

  // Rédirection
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  };
  const handleStartProjetClick = () => {
    navigate('/projet');
  };


  const words = ["fructrations.", "rentailités.", "chiffres."];
  
  // Email Copy
  const [buttonText, setButtonText] = useState('Email');

  const handleCopyEmail = () => {
    const email = 'christiantukundastocklin@gmail.com'; 
    navigator.clipboard.writeText(email).then(() => {
      setButtonText('Copied!');
      setTimeout(() => {
        setButtonText('Email');
      }, 2000); // Réinitialise le texte après 2 secondes
    }).catch(err => {
      console.error('Failed to copy email: ', err);
    });
  };
  useEffect(() => {
    AOS.init();
  }, []);
  
  return (
    <div className="App">
      <div className="head" id='head'>
        <div className="headLeft"></div>
        <header className="header">
          <span className="logo">Digilia</span>
          <nav className="nav"></nav>
          <div className="headerButton">
            <div className="spot">
              <span className="spotCircle"><span className="spotPoint">.</span></span>
              <span className="spotText">3 SPOT AVAILABLE</span>
            </div>
            <div className="headerButton">
              <div className="headerButton1" onClick={handleLoginClick}>Log in</div>
              <div className="headerButton2" onClick={handleStartProjetClick}>Start Projet</div>
            </div>
          </div>
        </header>
        <div className="headRight"></div>
      </div>

      <main>
        <div className="hero">
          <div className="heroText">
            <h1 className="heroText1" data-aos="fade-up" data-aos-duration="1000">
            Etendez votre business <br/>
            <span className="heroChange">boostez votre <span className="heroTextChange"><TypeWriterComponent words={words} period={2000} /></span></span>
            </h1>
            <p data-aos="fade-up" data-aos-duration="2000">
              Avec Digilia, augmenter l'impact et la notoriété de votre entreprise grâce à nos
              outils innovants de création de sites web, de solutions 3D et de digitalisation. 
              {/* <br/>Lancez vous librement dans l'universde Digilia. */}
            </p>
            <div className="heroButton">
                <div className="heroButton1" onClick={handleStartProjetClick}>Start Projet</div>
                <div className="heroButton2" onClick={handleCopyEmail}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="#63636A">
                  <path d="M320-80q-33 0-56.5-23.5T240-160v-80h-80q-33 0-56.5-23.5T80-320v-80h80v80h80v-320q0-33 23.5-56.5T320-720h320v-80h-80v-80h80q33 0 56.5 23.5T720-800v80h80q33 0 56.5 23.5T880-640v480q0 33-23.5 56.5T800-80H320Zm0-80h480v-480H320v480ZM80-480v-160h80v160H80Zm0-240v-80q0-33 23.5-56.5T160-880h80v80h-80v80H80Zm240-80v-80h160v80H320Zm0 640v-480 480Z"/>
                  </svg>
                  {buttonText}
                </div>
                {/* <img src="icons/aws.png"/> */}
              </div>
          </div>
        </div>
        <div>
          <div className="MarqueeDemo">
          <Marquee />
          </div>
        </div>


        <section id='services'>
          <ComponentService/>
        </section>
        
        <section id='about'>

          <ComponentRaison/>
          {/* <div>
          <h2>Pourquoi Choisir Digilia ?</h2>
          <p>
            Nous sommes dédiés à fournir des solutions digitales de haute qualité qui vous aident à atteindre vos objectifs commerciaux.
          </p>
          
          <h3>Facilité d'Utilisation</h3>
          <p>
            Nos outils sont conçus pour être intuitifs, vous permettant de créer et de gérer votre site web sans effort.
          </p>

          <h3>Personnalisation Complète</h3>
          <p>
            Personnalisez chaque aspect de votre site web pour qu'il reflète parfaitement votre marque.
          </p>

          <h3>Support Client Inégalé</h3>
          <p>
            Notre équipe est disponible 24/7 pour vous aider avec tout problème ou question.
          </p></div> */}
        </section>
        
       
          {/* <p>
            "Digilia a transformé notre présence en ligne. Nous avons vu une augmentation significative de notre trafic web et de nos ventes."
          </p>
          <p>
            "Les outils de Digilia sont incroyablement faciles à utiliser et le support client est exceptionnel."
          </p> */}
          
        <section>

          <ComponentTemoignage/>
        </section>
        
      </main>

      <div className="foot">
        <div className="footLeft"></div>
        <footer>
          <div className='footerRappel' data-aos="fade-up" data-aos-duration="600">
            <h2>Prêt à Transformer Votre Présence en Ligne ?</h2>
            <p>
              Contactez-nous aujourd'hui pour démarrer votre projet avec Digilia.
            </p>
            <div className="footerButton" data-aos="fade-up" data-aos-duration="2000">
              <div className="footerButton1" onClick={handleStartProjetClick}>Start Projet</div>
              <div className="footerButton2" onClick={handleLoginClick}>Log in</div>
            </div>
          </div>
          <ComponentFooter/>
        </footer>
        <div className='footRight'></div>
      </div>
      
    </div>
  );
}

// export default App;
function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/projet" element={<Dashboard />} />
      <Route path="/projet-maker" element={<ProjetPage />} />
      {/* Ajoutez d'autres routes ici */}
    </Routes>
  );
}

export default Router;