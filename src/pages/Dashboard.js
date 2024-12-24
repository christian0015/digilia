import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProjetMaker from './ProjetMaker';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userUpdate, setUserUpdate] = useState("");

  const [projets, setProjets] = useState([]);
  const [newProjet, setNewProjet] = useState({ name: '', description: '', code: '' });
  const [editingProjet, setEditingProjet] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('digiliaUser');
    const userProfil = JSON.parse(userString);
    setUser(userProfil);
    setUserUpdate(userProfil);
    console.log(userUpdate)

    fetchProjets();
  }, []);

  
  const handleLogout = () => {
    localStorage.removeItem('digiliaUser');
    navigate('/');
  };

  // API **************************************
  // const handleUpdateUser = async (userUpdate) => {
  //   try {
  //     const username= userUpdate.username;
  //     const email= userUpdate.email;
  //     const password= userUpdate.password;
      
  //     const res = await fetch(` https://digilia-server.vercel.app/api/auth/update/${user._id}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: {userUpdate, username, email,password},
  //     })
  
  //     if (res.ok) {
  //       const updatedUserData = await res.json()
  //       return { success: true, message: 'User updated successfully' }
  //     } else {
  //       console.error('Error updating user:', res.status, res.statusText)
  //       return { success: false, message: 'Error updating user' }
  //     }
  //   } catch (error) {
  //     console.error('Error:', error)
  //     return { success: false, message: 'Error updating user' }
  //   }
  // }
  
  
  const handleUpdateUser = async () => {
    console.log(userUpdate)
    if (!userUpdate._id || !userUpdate.username || !userUpdate.email) {
      return setMessage({ type: 'error', text: 'Tous les champs sont obligatoires' });
    }
    try {
      
    const response = await axios.put(
      'https://digilia-server.vercel.app/api/auth/update',
      userUpdate // Envoi des données de l'utilisateur
    );
      setUser(response.data.user);
      setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mises à jour du profil.' });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`https://digilia-server.vercel.app/api/auth/delete/${user._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      handleLogout();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du compte.' });
    }
  };

  const handleLastProjet = async () => {
      navigate('/projet-maker');
      
  };

    // Create project
  const handleCreateProjet = async () => {
    try {
      const response = await axios.post('https://digilia-server.vercel.app/api/projets/createProjet', {
        userId: user._id,
        newProjet,
      });
      setProjets([...projets, response.data.projet]);
      setNewProjet({ name: '', description: '', code: '' });
      navigate('/projet-maker');
      setMessage({ type: 'success', text: 'Projet créé avec succès.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la création du projet.' });
    }
  };

  const fetchProjets = async () => {
    try {
      const userString = localStorage.getItem('digiliaUser');
      const userProfil = JSON.parse(userString);
      const response = await axios.get('https://digilia-server.vercel.app/api/projets/getUserProjets', {
        params: { userId: userProfil._id }, // Envoi de userId en tant que paramètre de requête
      });
      setProjets(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: JSON.stringify(user) });
    }
  };
  


  const handleUpdateProjetCode = async (projetId, userId, newCode, ) => {
    try {
      const response = await axios.put(`https://digilia-server.vercel.app/api/projets/updateProjetName/${projetId}`, userId, newCode, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProjets(response.data.projet._id === projetId ? response.data.projet : "");
      setEditingProjet(null);
      setMessage({ type: 'success', text: 'Nom du projet mis à jour avec succès.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du projet.' });
    }
  };

  const handleUpdateProjetName = async (projetId, updatedName) => {
    try {
      const response = await axios.put(`https://digilia-server.vercel.app/api/projets/updateProjetName/${projetId}`, { newName: updatedName }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProjets(projets.map(projet => projet._id === projetId ? response.data.projet : projet));
      setEditingProjet(null);
      setMessage({ type: 'success', text: 'Nom du projet mis à jour avec succès.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du projet.' });
    }
  };

  const handleDeleteProjet = async (projetId) => {
    try {
      await axios.delete(`https://digilia-server.vercel.app/api/projets/deleteProjet/${projetId}`, user._Id, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProjets(projets.filter(projet => projet._id !== projetId));
      setMessage({ type: 'success', text: 'Projet supprimé avec succès.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du projet.' });
    }
  };


  return (
    <div className="dashboard">
      <h1>Tableau de Bord</h1>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
      {user && (
        <div className="user-info">
          <h2>Bienvenue, {user.username}</h2>
          <p>Email : {user.email}</p>

          <br></br>
          <details>
            <summary>Modifier mon profil</summary>
            <div>
              <input type="text" value={userUpdate.username} onChange={(e) => setUserUpdate({ ...userUpdate, username: e.target.value})}></input>
              <br/>
              <input type="email" value={userUpdate.email} onChange={(e) => setUserUpdate({ ...userUpdate, email: e.target.value})}></input>
              <br/>
              <button onClick={handleUpdateUser}>Modifier Profil</button>
              <br/><br/>

              <p>Supprimer définitivement mon compte</p>
              <button onClick={handleDeleteUser}>Supprimer Compte</button>
            </div>
          </details>

          <br/><br/>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      )}

      <div className="projets-section">
        <h2>Creation un nouveau projet</h2>
        <div className="projet-form">
          <input
            type="text"
            placeholder="Nom du projet"
            value={newProjet.name}
            onChange={(e) => setNewProjet({ ...newProjet, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newProjet.description}
            onChange={(e) => setNewProjet({ ...newProjet, description: e.target.value })}
          />
          <textarea
            placeholder="Code"
            value={newProjet.code}
            onChange={(e) => setNewProjet({ ...newProjet, code: e.target.value })}
          />
          <button onClick={handleCreateProjet}>Créer Projet</button>
        </div>

        <br/>
        <h2>Vos Projets</h2>
        <ul className="projets-list">
          {projets.map(projet => (
            <li key={projet._id}>
              {editingProjet === projet._id ? (
                <input
                  type="text"
                  value={projet.name}
                  onChange={(e) => handleUpdateProjetName(projet._id, e.target.value)}
                />
              ) : (
                <>
                  <h3>{projet.name}</h3>
                  <p>{projet.description}</p>
                  <button onClick={() => handleLastProjet()}>Démarrer</button>
                  <button onClick={() => setEditingProjet(projet._id)}>Modifier</button>
                  <button onClick={() => handleDeleteProjet(projet._id)}>Supprimer</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// export default Dashboard;
function Router() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projet-maker" element={<ProjetMaker/>} />
      {/* Ajoutez d'autres routes ici */}
    </Routes>
  );
}

export default Router;