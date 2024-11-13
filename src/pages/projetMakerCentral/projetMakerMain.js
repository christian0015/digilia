import React, { useState } from 'react';

 export default function ProjetMakerMain(){
  return(
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

          <div className="container-middle-projet-maker-content">
            <button onClick={toggleContainerRigthProjetMaker} className={isShown ? 'container-middle-projet-maker-content-buttonMenu active' : 'container-middle-projet-maker-content-buttonMenu'}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff"><path d="M666-440 440-666l226-226 226 226-226 226Zm-546-80v-320h320v320H120Zm400 400v-320h320v320H520Zm-400 0v-320h320v320H120Zm80-480h160v-160H200v160Zm467 48 113-113-113-113-113 113 113 113Zm-67 352h160v-160H600v160Zm-400 0h160v-160H200v160Zm160-400Zm194-65ZM360-360Zm240 0Z"/></svg>
            </button>

            <Routes>
              {/* <Route path="/" element={<FrameRendu />} /> */}
              {/* <Route path="/FrameRendu" element={<FrameRendu />} /> */}
              <Route path="/Session" element={<Label/>} />
              <Route path="/Div" element={<Label/>} />
              <Route path="/Span" element={<Label/>} />
              <Route path="/Label" element={<Label/>} />
              <Route path="/ZoneText" element={<Label/>} />
              <Route path="/Button" element={<Label/>} />

              {/* Route par défaut qui redirige vers le FrameRendu */}
              {/* <Route path="*" element={<Navigate to="/FrameRendu" />} /> */}
            </Routes>

            <div className='activeComponent' style={{ flex: 1, padding: "20px" }}>
              {activeComponent} {/* Rendu du composant actif */}
            </div>

          </div>
        </div>
  )
}