
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import FrameRendu from './projetMakerCentral/projetMakerMain';
import FrameRendu from './Main';
// import FrameRendu from './projetMakerCentral/projetMakerMain';
import AddContainer from '../AddContainer';
import AddHeader from '../AddHeader';
import PropertyEditor from './PropertyEdit';
import Label from '../../Dashboard';
import Session from '../../LoginPage';
import Div from '../../LoginPage';
import ZoneText from '../../LoginPage';
import Button from '../../LoginPage';
import Formulaire from '../../LoginPage';
import './ProjetMaker.css';
import { Link, NavLink  } from 'react-router-dom';

const userString = localStorage.getItem('digiliaUser');
const userProfil = JSON.parse(userString);
console.log(userProfil);

const ProjetPage = () => {
  const [activeComponent, setActiveComponent] = useState(""); // Par défaut, le composant Home est affiché

  // Fonction pour changer le composant
  const handleComponentChange = (component) => {
    setActiveComponent(component);
    setIsShownActiveComponent("block")
  };
  const [isShownActiveComponent, setIsShownActiveComponent] = useState("none");
  const toggleActiveComponent = () => {
    setIsShownActiveComponent("none");
  };

  const [isShown, setIsShown] = useState(false);
  const toggleContainerRigthProjetMaker = () => {
    setIsShown(!isShown);
    };
  return (
    <div>
      <div className="projet-maker">

        {/* /**************************************** projet-maker right ******************************* */}
        <div className={isShown ? 'show container-rigth-projet-maker' : 'container-rigth-projet-maker'}>
          <div className="projet-maker-userProfil">
            <span className="projet-maker-userProfil-imgs">
              {userProfil.role=="admin" ?
                <img src="https://i.pinimg.com/originals/ce/e6/75/cee675d2ceba4f3470a219c88a69aef6.jpg" width={50} className="userProfilImg" alt="Boss"/> :
                 <img src="https://i.pinimg.com/originals/ce/e6/75/cee675d2ceba4f3470a219c88a69aef6.jpg" width={50} className="userProfilImg" alt="Gerant"/>
              }
            </span>
            <span className="projet-maker-userProfil-info">
              <span>{userProfil.username}</span>
              <span className='projet-maker-userProfil-info-text'>{userProfil.role}</span>
            </span>
          </div>

          <div className="container-rigth-projet-maker-links">

            <NavLink onClick={() => handleComponentChange()}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Run</span>
            </NavLink >

            <NavLink onClick={() => handleComponentChange(<AddContainer />)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Add</span>
            </NavLink >

            <NavLink onClick={() => handleComponentChange(<PropertyEditor />)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>PropertyEditor</span>
            </NavLink >

            <NavLink onClick={() => handleComponentChange(<AddHeader />)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>AddHeader</span>
            </NavLink >

            <NavLink onClick={() => handleComponentChange(<Label />)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Formulaire</span>
            </NavLink >

            <NavLink  to="/Div">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Design conseil</span>
            </NavLink >

            <NavLink  to="/Label">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Tutoriels</span>
            </NavLink >

            <NavLink  to="/ZoneText" activeClassName="active-link">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Deployement</span>
            </NavLink >

          </div>
          <div className="container-rigth-projet-maker-links spaceTop">
            <NavLink  to="/" className="ButtonPage">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>
              <span>Optimist SEO</span>
            </NavLink >
          </div>
                    
        </div>

        {/* /**************************************** projet-maker Center ******************************* */}
        <div className="container-middle-projet-maker">
          <div className='container-middle-projet-maker-header'>
            <div className="container-middle-projet-maker-textLogo">
              <h1>Digilia FrameRendu</h1>
              <h3>NetKin</h3>  
            </div>   
            <div className="container-middle-projet-maker-header-rigth">
              <span className="container-middle-projet-maker-header-rigth-imgs">
                  <img src="https://i.pinimg.com/originals/ce/e6/75/cee675d2ceba4f3470a219c88a69aef6.jpg" width={50} className="container-middle-projet-maker-header-rigth-img" alt="logo"/> 
              </span>
              <span className="container-middle-projet-maker-header-rigth-info">
                <span className='container-middle-projet-maker-header-rigth-info-text'>Projet 3</span>
              </span>
            </div>
          </div>
          
          <button onClick={toggleContainerRigthProjetMaker} className={isShown ? 'container-middle-projet-maker-content-buttonMenu active' : 'container-middle-projet-maker-content-buttonMenu'}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff"><path d="M666-440 440-666l226-226 226 226-226 226Zm-546-80v-320h320v320H120Zm400 400v-320h320v320H520Zm-400 0v-320h320v320H120Zm80-480h160v-160H200v160Zm467 48 113-113-113-113-113 113 113 113Zm-67 352h160v-160H600v160Zm-400 0h160v-160H200v160Zm160-400Zm194-65ZM360-360Zm240 0Z"/></svg>
          </button>
          <div className="container-middle-projet-maker-content">
            <FrameRendu className="framerendu"/>
          </div>
          <div className='activeComponent' style={{ flex: 1, padding: "20px", display:isShownActiveComponent }}>
            <button onClick={toggleActiveComponent}>Close frame</button>
            {activeComponent}
          </div>     

          
        </div>
        
        <br/>

        {/* /**************************************** projet-maker left ******************************* */}
        <div className={isShown ? 'show container-left-projet-maker' : 'container-left-projet-maker'}>
          <div>
            <PropertyEditor/>
          </div>

          <br/>
          
          <br/>
          <div className="projet-maker-userProfil">
            <span className="projet-maker-userProfil-imgs">
              {userProfil.role=="admin" ?
                <img src="https://i.pinimg.com/originals/ce/e6/75/cee675d2ceba4f3470a219c88a69aef6.jpg" width={50} className="userProfilImg" alt="Boss"/> :
                 <img src="https://i.pinimg.com/originals/ce/e6/75/cee675d2ceba4f3470a219c88a69aef6.jpg" width={50} className="userProfilImg" alt="Gerant"/>
              }
            </span>
            <span className="projet-maker-userProfil-info">
              <span>{userProfil.username}</span>
              <span className='projet-maker-userProfil-info-text'>Effet</span>
            </span>
          </div>

          <br/>
          <div className="projet-maker-userProfil">
            <span className="projet-maker-userProfil-info">
              <span>{userProfil.username}</span>
              <span className='projet-maker-userProfil-info-text'>2D Objet</span>
            </span>
          </div>
          
          <br/>
          <div className="projet-maker-userProfil">
            <span className="projet-maker-userProfil-info">
              <span>{userProfil.username}</span>
              <span className='projet-maker-userProfil-info-text'>3D Objet</span>
            </span>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default ProjetPage;
